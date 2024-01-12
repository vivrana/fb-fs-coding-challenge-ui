class CreateBalanceHistories < ActiveRecord::Migration[7.1]
  def change
    create_table :balance_histories do |t|
      t.integer :user_id
      t.integer :starting_balance
      t.integer :ending_balance

      t.timestamps
    end
  end
end
