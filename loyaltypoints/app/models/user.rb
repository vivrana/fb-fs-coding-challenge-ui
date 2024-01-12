class User < ApplicationRecord
  # Enforcing an initial max.  We should set this significantly higher in our migrations as well as in
  # validations, but for our current exercise, the primary purpose is to show that we've thought of overflow.
  MAX_BALANCE = 2**31 - 1

  has_many :balance_histories

  validates :balance, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: MAX_BALANCE }, presence: true

  before_save :append_to_history

  def append_to_history
    if balance_was != balance
      BalanceHistory.create!(user_id: self.id, starting_balance: self.balance_was, ending_balance: self.balance)
    end
  end
end
