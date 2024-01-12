# frozen_string_literal: true

# BalanceInputScheme provides a class from which we can derive different input schemes.
# This is an overkill and I wouldn't have this implemented in production unless we start to see a
# pattern emerge.  I wanted to get a tiny bit fancy to see how we can feed in different schemes
# and thus easily create actions that utilize those schemes while keeping the points calculation
# logic out of the way.
class BalanceInputScheme
  attr_accessor :value, :points
  def initialize(value)
    @value = value
  end

  # Ensure that this is overridden by the correct balance input schemes
  def points
    raise NotImplementedError
  end
end
