class ChangeDataTypeOfAttributeName < ActiveRecord::Migration[6.1]
  def change
    change_column :plans, :round_size, :integer
  end
end
