class User < ApplicationRecord
  has_many :balance_histories

  validates :balance, numericality: { greater_than_or_equal_to: 0 }, presence: true

  before_save :append_to_history

  def append_to_history
    if balance_was != balance
      BalanceHistory.create!(user_id: self.id, starting_balance: self.balance_was, ending_balance: self.balance)
    end
  end
end
