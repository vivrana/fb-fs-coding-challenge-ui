# About

This is the server to handle Loyalty Points of a set of users.  Currently, the app relies on
a static number of users having ID 1 and 2, with points 100 and 50 respectively.

Things you may want to cover:

* Ruby version: 3.3

* Setup:
  * Install the latest version of Ruby (3.3 as of Jan 11) by following the guide at https://www.ruby-lang.org/en/documentation/installation/.
    * In summary: you can use a package manager like `brew` on MacOS or `asdf` and install Ruby.
    * Heads up, depending on your package manager, you may need to add newly installed ruby to your path
      (e.g. echo `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc`).  Followed by starting a new terminal session.
  * You may need to install bundler: `gem install bundler`
  * from the `loyaltypoints` directory:
    * run `bundle install`
    * `bundle exec rake db:reset`
    * You can run tests by: `bundle exec rake test`
    * Launch Rails server with `bundle exec rails s`
    * Play!

Default values:

Note that the test/fixtures/users.yml file hosts the initial default for the user and their balances.  Please feel free to modify.
and to `bundle exec rake db:reset` if you want to get back to the default values/re-seed.  Note that Rails stores
fixtures under `test` directory so it seems weird to have the dev/prod defaults there.  However, this turned out to be a
good way to share the values in test as well and avoid needing two copies (one in seeds.rb, which seemed to only update
the dev DB and another in fixtures file for the tests.)

** Notes **

I've implemented an arbitrary limit of unsigned 32 bit int as max value for `balance` to protect from unexpected
overflows.  However, we can of course tweak this.  Just pointing it out as an explicit decision.  Normally, we'll have
a generous limit to being with but keeping it more contained for now.

There are some versioning gems available to keep track of transaction histories and such.  I've opted to write this
code myself as this is a take-home exercise - I'm assuming you'll have better signals with code I'm writing rather than
configuring in a gem.

I wanted to write an offset pagination module to restrict the balance histories but seeing how much time I've already
taken, I'm falling back to a common Rails solution - the Kaminari gem for paging the results.  Its actually far more
feature-rich than our requirement.  We don't use Rails views and related templates here.
Its defaults are under config/initializers/kaminari_config.rb.  It restricts 25 items per page by default.

There is reference to points "transactions" in the requirement.  To disambiguate from the DB "transactions",
I've chosen the name model name to be `balance_histories` to match the user DB's `balance` column name.  I've allowed
the routes (API endpoint) to be "transactions" to ensure that API is still sees "transactions" as the name, matching
the requirement.  For production code, I'd ensure that we are in alignment for naming conventions before coding.

I realize that the return format of the transactions is not ideal.  As in, current
implementation takes a naive approach of returning raw values.  We may want to massage them to add some some facts and
(like the fact that user point redemption/addition happened) as well as to format dates appropriately
(Internationalization or other criteria.)  I'm keeping time in mind and mentioning this as a future ToDo.

If transaction histories get too big, then we can scale in a few ways:
- Add an index on user_id in the balance_histories table as it grows in size.
- Some DBs will benefit from sharding.  I'm listing two possible ways to shard, with summarized pros and cons:
  - DB can be sharded per enterprise customer.  I've seen this successfully done in large scale production instances.
    It has the advantage of keeping Enterprise customer data separate and to support region-specific data location
    requirements.  Plus, if the tenancy is well managed, there is a lesser chance of data leak across customer
    instances and greater security.  On the flip size, hot shards are possible with large customer.  Some secondary
    sharding scheme may be necessary in some instances.  Managing complex sharding can be error prone.
  - Shard by key/ID: perhaps shard across instances based on user_id.  While several DBs can re-balance keys
    more easily if there is a need for horizontal scaling the DB, there may be DB-specific pain points that we may need
    to address for avoiding DB-specific data replication edge cases - like increased latency during scaling; I've heard
    of instances where data race leads to some data being missed, specifically keys that are transitioning to another
    shard while a shard comes up and are being updated at the same time.  It may be wise to pre-plan a sufficiently
    large number of shards from get-go and avoid the need for horizontal scaling later, thus simplifying deployment.
- Note that if a DB is configured to be read-heavy, it may be wise to do an async insert into the balance_histories.
  In some instances, inserting into a large table is slow.  Publishing first to a queue, followed by an async process
  inserting the record into the DB may be a better option.

