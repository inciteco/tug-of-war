export now=$(date +'%Y-%m-%dT%H:%M:%S')
export optin_path="reports/$now-opt_ins.csv"
export entries_path="reports/$now-entries.csv"

# opt-ins
# Note: excludes falsey opt-ins and emails on staff/test domains
exec firebase database:get /opt_ins | \
  jq '[ .[] |
        select(.opt_in == true) |
        select(.email | contains("ssp.la")          | not) |
        select(.email | contains("rbi.com")         | not) |
        select(.email | contains("gsdm.com")        | not) |
        select(.email | contains("popeyes.com")     | not) |
        select(.email | contains("inciteco.com")    | not) |
        select(.email | contains("helloworld.com")  | not) |
        select(.email | contains("lab-media.com")   | not) |
        {name: .name, email: .email, opt_in: .opt_in}]' | \
  ./node_modules/json2csv/bin/json2csv.js -o $optin_path &&
  echo generated: $optin_path

# entries
# Note: excludes falsey opt-ins and emails on staff/test domains
exec firebase database:get /entries | \
  jq '[ .[] |
        .[] |
        select(.email | contains("ssp.la")          | not) |
        select(.email | contains("rbi.com")         | not) |
        select(.email | contains("gsdm.com")        | not) |
        select(.email | contains("popeyes.com")     | not) |
        select(.email | contains("inciteco.com")    | not) |
        select(.email | contains("helloworld.com")  | not) |
        select(.email | contains("lab-media.com")   | not) |
        {name: .name, email: .email, earned_at: .earned_at}]' | \
  ./node_modules/json2csv/bin/json2csv.js -o $entries_path &&
  echo generated: $entries_path

printf "\n👍  Done generating reports!\n\n"

exec open ./reports/
