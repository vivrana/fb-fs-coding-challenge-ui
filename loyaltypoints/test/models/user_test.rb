require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "balance more than 0" do
    user = User.new
    user.balance = -1
    assert !user.valid?, true
    assert user.errors.messages.first,
           I18n.t("activerecord.errors.models.user.attributes.balance.numericality.greater_than_or_equal_to")
  end

  test "balance cannot be blank" do
    user = User.new
    user.balance = nil
    assert !user.valid?, true
    assert user.errors.messages.first,
           I18n.t("activerecord.errors.models.user.attributes.balance.blank")
  end

  test "transaction updated when balance is changed" do
    assert User.find(1).update(balance: 50), true
    histories = BalanceHistory.where(user_id: 1)
    assert histories.count, 1
    assert histories.first.starting_balance, 100
    assert histories.first.ending_balance, 50
  end
end
