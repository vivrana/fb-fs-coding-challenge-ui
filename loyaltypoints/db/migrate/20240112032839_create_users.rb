class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.integer :balance, default: 0

      t.timestamps
    end
  end
end
