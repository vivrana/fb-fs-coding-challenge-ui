require_relative '../models/balance_schemes/balance_amount_scheme'

class PointsController < ApplicationController
  # If we can't find the user, then render errors.  Our get balance and update balance
  # methods don't need to do anything if we don't have a valid user.
  before_action :load_user

  def balance
    return unless @user

    render json: @user
  end

  # Redeem points in USD value.
  # params should include valid user_id and the points that we want to redeem.
  # E.g. post "points/redeem/1", params: { points: 10 }.  This will reduce 10 points from User with
  # id 1.
  # Side effect: We add a balance history record to point out whenever a balance change happens.
  def redeem
    return unless @user

    points = params[:points].to_i
    # Actually our activerecord validation checks for the balance going negative, but
    # keeping it here for additional sanity.
    if points < 0
      render status: :bad_request, json: { error_message: I18n.t("negative_points") }
      return
    end

    # Points calculation from Amount is fairly static for now.  However, we can certainly
    # imagine a future where we can dynamically swap out the scheme per input request or in reaction
    # to other configuration change.
    points = BalanceAmountInputScheme.new(points, :usd).points
    if @user.balance - points < 0
      render status: :bad_request, json: { error_message: I18n.t("invalid_points") }
      return
    end

    @user.update!(balance: @user.balance - points)
    render status: :ok
  end

  # Add points in USD value.
  # Params should include valid user_id and the points that we want to add.
  # E.g. post "points/add/1", params: { points: 10 }.  This will add 10 points to the balance of User with
  # id 1.
  # Side effect: We add a balance history record to point out whenever a balance change happens.
  def add
    return unless @user

    points = params[:points].to_i
    if points < 0
      render status: :bad_request, json: { error_message: I18n.t("invalid_balance") }
      return
    end

    points = BalanceAmountInputScheme.new(points, :usd).points
    if User::MAX_BALANCE - @user.balance < points
      render status: :bad_request, json: { error_message: I18n.t("invalid_balance") }
      return
    end

    @user.update!(balance: @user.balance + points)
    render status: :ok
  end

  # transactions returns the history of balance/points changes for the given user.
  # It expects a page parameter (default 1st page) and if page_size is not specified, then it defaults to 25
  # E.g. get "points/transactions/1?page=2&page_size=50".  This will fetch the second page of balance history for
  # the user with id 1.  For now, I've fixed an "order" but we should be more flexible here.  Perhaps have a
  # white-listed set of order parameter values that we can pass to ActiveRecord for ordering on the list.
  # @return [{user_id, starting_balance, ending_balance, created_at, updated_at}... ]
  def transactions
    return unless @user

    page = params[:page]&.to_i
    page_size = params[:page_size]&.to_i # ToDo: have upper bound validation on page size
    if (page && page <= 0) || (page_size && page_size <= 0)
      # Note that we should return a not found to ensure that links with invalid page values don't get indexed by
      # search engines or external partners.
      render status: :not_found
    end

    histories = BalanceHistory.where(user_id: @user.id).order('updated_at asc')
    histories = histories.page(page) if page
    histories = histories.per(page_size) if page_size
    if histories.none?
      render status: :not_found
    else
      render json: histories
    end
  end

  private

  # Guard method to ensure that we have valid user id for which we are performing an
  # activity.  This is applicable across several of our actions and thus is called as
  # a before_action.
  def load_user
    user_id = params[:user_id].to_i
    if user_id <= 0
      render status: :bad_request, json: { error_message: I18n.t("invalid_user_id") }
      return
    end

    @user = User.where(id: user_id).first
    return @user if @user

    render status: 404, json: { error_message: I18n.t("user_not_found") }
  end
end
