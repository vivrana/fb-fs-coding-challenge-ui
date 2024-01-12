# frozen_string_literal: true

require_relative './balance_input_scheme'

# BalanceAmountInputScheme is a static USD amount multiplier scheme.  However, we can
# imagine having more sophisticated schemes introduced over time.  This helps with separation
# of concerns with the balance calculation.  Note that its an overkill at this point but exists
# mainly to show that this may help introduce some flexibility here.
class BalanceAmountInputScheme < BalanceInputScheme
  CURRENCY_TO_POINTS = {
    usd: 10
  }

  attr_accessor :currency
  def initialize(value, currency)
    super(value)
    raise NotImplementedError unless CURRENCY_TO_POINTS.key?(currency)

    @currency = currency
  end

  # Ensure that this is overridden by the correct balance input schemes
  def points
    @points ||= @value * CURRENCY_TO_POINTS[@currency]
  end
end
