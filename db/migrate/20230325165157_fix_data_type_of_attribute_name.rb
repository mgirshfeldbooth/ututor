class FixDataTypeOfAttributeName < ActiveRecord::Migration[6.1]
  def up
    change_column :plans, :round_size, :integer, using: 'round_size::integer'
  end

  def down
    change_column :plans, :round_size, :string
  end
end
