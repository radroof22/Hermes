angular
    .module("API")
    .controller("Broker",function($scope,$q,$http,BrokerAPI){
        //constants for urls
        var url_accounts = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/api/useraccounts/?format=json"
        var url_users = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/api/user/?format=json"


        $scope.stockSearchData;
        $scope.dataStock;
        $scope.showStockInformation = false;
        $scope.show_error = false;
         $scope.estBalance = 0;
        $scope.show_current_portfolio = true;
        $scope.show_history = false;
        $scope.show_balance_record = false;
        $scope.sell_section = false;
        $scope.shares_to_sell
        var shares_bought
        $scope.sell_error = false;
        $scope.sell_port_confirm = false;
        $scope.graph_data = ["a"]

        $scope.show_firm_table = false;
        $scope.member_info_to_table = [];
        $scope.getStockSearch = function(stock){
                BrokerAPI.getStock(stock).then(function(data){
                    //get table data
                    $scope.dataStock = data
                    $scope.dataStock = $scope.dataStock.data.query.results.quote
                    $scope.showStockInformation = true;      

                
                }).error(function(error){
                    console.log(error);
                });
                                     
        }

        $scope.searchStockFunc = function(){
            $scope.num_of_shares = document.getElementById('share_number').value;
            $scope.share_price = document.getElementById('share_price').value;
            $scope.balance = document.getElementById('balance').value;
            var buy_btn = document.getElementById("btn_buy")

            $scope.cost = (parseFloat($scope.num_of_shares)* (parseFloat($scope.share_price))).toFixed(2);
            $scope.estBalance = parseFloat($scope.balance) - $scope.cost;

            if ($scope.estBalance < 0){
                buy_btn.disabled = true;
                $scope.show_error = true;
            }
            if ($scope.estBalance >= 0){
                $scope.show_error = false;
                document.getElementById("btn_buy").disabled = false;
            }
        }

        $scope.showSellSection = function(num_of_shares, row_id){

            shares_bought = num_of_shares
            document.getElementById('orig_shares_buy').value = num_of_shares;
            document.getElementById('row_id').value = row_id;
            $scope.sell_section = !$scope.sell_section
            
        }

        
        $scope.checkSellParams = function(){


            if (parseFloat(shares_bought) < parseFloat($scope.shares_to_sell)){
                document.getElementById("sell_btn").disabled = true;
                $scope.sell_error = true;
            }
            if (parseFloat(shares_bought) >= parseFloat($scope.shares_to_sell)){
                $scope.sell_error = false;
                document.getElementById("sell_btn").disabled = false;
            }
        }

        $scope.sellStockCompute = function(){
            $scope.balance = document.getElementById('balance').value;
            $scope.sell_balance = parseFloat($scope.balance) + (parseFloat($scope.dataStock.LastTradePriceOnly) * parseFloat($scope.share_number_sell));

        }

        $scope.close_all_profile_tabs = function(){
            document.getElementById('portfol').className  = ""
            document.getElementById('records').className  = ""
            document.getElementById('balance').className  = ""
            $scope.show_current_portfolio = false;
            $scope.show_history = false;
            $scope.show_balance_record = false;
        }

        $scope.createActiveTab = function(id){
            document.getElementById(id).className = "active"
        }

        $scope.get_latest_transactions = function(setting){

            week_id = document.getElementById("week")
            month_id = document.getElementById("month")
            year_id = document.getElementById("year")

            week_id.className = "btn btn-default"
            month_id.className = "btn btn-default"
            year_id.className = "btn btn-default"

            var transactions;
            BrokerAPI.getTransactions().then(function(data){
                transactions = data.data  
                switch(setting){
                    case 'Year':
                        year_id.className += " active"
                        $scope.graph_data = []

                        //get last week
                        var day = new Date();
                        var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                        var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 365));
                        //If nextWeek is smaller (earlier) than the value of the input date, alert...
                        for (var i = 0; i<transactions.length; i++){
                            var transaction_date = transactions[i].Date_Time.split('-');
                            year = transaction_date[0];
                            month = transaction_date[1];
                            day = transaction_date[2].split('T')[0];

                            if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                if ( parseFloat(transactions[i].Account) == parseFloat(account_num)){
                                    $scope.graph_data.push(transactions[i])
                                }
                            }
                        }
                        break;
                    case 'Month':
                        month_id.className += " active"
                        $scope.graph_data = []

                        //get last week
                        var day = new Date();
                        var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                        var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 30));
                        //If nextWeek is smaller (earlier) than the value of the input date, alert...
                        for (var i = 0; i<transactions.length; i++){
                            var transaction_date = transactions[i].Date_Time.split('-');
                            year = transaction_date[0];
                            month = transaction_date[1];
                            day = transaction_date[2].split('T')[0];

                            if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                if ( parseFloat(transactions[i].Account) == parseFloat(account_num)){
                                    $scope.graph_data.push(transactions[i])
                                }
                            }
                        }
                        break;
                    case 'Week':
                        week_id.className += " active"
                        $scope.graph_data = []
                        //get users account id
                        account_num = document.getElementById("account_num").value
                        console.log(account_num)
                        
                        //get last week
                        var day = new Date();
                        var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                        var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 7));
                        //If nextWeek is smaller (earlier) than the value of the input date, alert...
                        for (var i = 0; i<transactions.length; i++){
                            var transaction_date = transactions[i].Date_Time.split('-');
                            year = transaction_date[0];
                            month = transaction_date[1];
                            day = transaction_date[2].split('T')[0];

                            if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                if ( parseFloat(transactions[i].Account) == parseFloat(account_num)){
                                    $scope.graph_data.push(transactions[i])
                                }
                            }
                        }
                    break;
                }

                

                //correct data for x: and y:
                console.log(transactions)
                previous_day = 0
                final_data = []
                for (var i=0;i<$scope.graph_data.length;i++){
                    var transaction_date = $scope.graph_data[i].Date_Time.split('-');
                    year = transaction_date[0];
                    month = transaction_date[1];
                    day = transaction_date[2].split('T')[0];
                    if (previous_day == day){continue;}                    
                    previous_day = day
                    var balance = $scope.graph_data[i].Balance_at_Time
                    to_push = {x: new Date(year, month, day), y: balance}
                    final_data.push(to_push)
                }
                var chart = new CanvasJS.Chart("graph",
                    {
                    //theme: "theme2",
                    title:{
                        text: "Account Balance - per "+setting
                    },
                    animationEnabled: true,
                    axisX: {
                        interval:1,
                        intervalType: "days"
                        
                    },
                    axisY:{
                        includeZero: false
                        
                    },
                    data: [{
                        dataPoints:final_data,
                        type:"spline",
                    }]
                    });

                chart.render();

                                
            }).error(function(error){
                console.log(error);
                });
            
            }
        

        $scope.getFirmImprovement = function(setting){
                

                week_id = document.getElementById("weekPercent")
                month_id = document.getElementById("monthPercent")
                year_id = document.getElementById("yearPercent")

                user_ids = document.getElementById("user_accounts_in_firm").value
                users = document.getElementById("users").value

                week_id.className = "btn btn-default"
                month_id.className = "btn btn-default"
                year_id.className = "btn btn-default"

                var transactions;
                BrokerAPI.getTransactions().then(function(data){
                    transactions = data.data  
                    switch(setting){
                        case 'Year':
                            year_id.className += " active"

                            //get user accounts to look for
                            $scope.users_in_firm = user_ids_to_look = user_ids.split(";")
                            
                            //get transactions that are applicable for accounts
                            user_transactions = []

                            for(i=0;i<user_ids_to_look.length;i++){
                                for(i=0;i<transactions.length;i++){
                                    current_transaction = transactions[i]
                                    current_user_id = user_ids_to_look[i]
                                    if(current_transaction.Account.id == current_user_id){
                                        user_transactions.push(current_transaction)
                                    }
                                }
                            }

                            // get trades in proper time frame
                            time_satisfied_transactions = []
                            //get last week
                            var day = new Date();
                            var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                            var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 365));
                            //If nextWeek is smaller (earlier) than the value of the input date, alert...
                            for (var i = 0; i<user_transactions.length; i++){
                                var transaction_date = user_transactions[i].Date_Time.split('-');
                                year = transaction_date[0];
                                month = transaction_date[1];
                                day = transaction_date[2].split('T')[0];

                                if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                        time_satisfied_transactions.push(user_transactions[i])
                                }
                            }
                            $scope.member_info_to_table = []
                            //get users and accounts
                            users_from_api = $http.get(url_users, {cache: false});
                            user_accounts = $http.get(url_accounts, {cache: false});

                            $q.all([users_from_api, user_accounts]).then(function(values) {
                                users_from_api = values[0].data
                                user_accounts = values[1].data
                                
                                // for each account, log transactions in .transactions property
                                angular.forEach (user_accounts, (current_account, key) => {
                                    member_info = {}
                                    console.log(current_account+"{"+user_accounts.length+"}")
                                    accounts_transactions = []
                                    current_id = current_account.id
                                    accounts_user_id = current_account.User

                                    // loop through all transactions and give ones to match to the user account to a varibale
                                    for(i=0; i<time_satisfied_transactions.length;i++){
                                        
                                        if (time_satisfied_transactions[i].Account == current_id){
                                            accounts_transactions.push(time_satisfied_transactions[i])
                                        }
                                    }

                                    //match user id to user account's user id
                                    for(i=0;i<users_from_api.length;i++){
                                        current_user = users_from_api[i]
                                        //if match found
                                        if(current_user.id == accounts_user_id){
                                            member_info = new Object()
                                            member_info["username"] = current_user.username
                                            pct_difference = (parseFloat(accounts_transactions[0].Balance_at_Time) - parseFloat(user_accounts[i].Money)) / parseFloat(accounts_transactions[0].Balance_at_Time)
                                            pct_difference = (((pct_difference)).toFixed(2))
                                            console.log(pct_difference)
                                            member_info["change"] = pct_difference
                                            member_info["current_balance"] = user_accounts[i].Money
                                            $scope.member_info_to_table.push(member_info)
                                            continue
                                        }
                                    }
                                });
                                

                            
                            console.log($scope.member_info_to_table)
                            $scope.show_firm_table = true
                            });
                            
                            break;
                        case 'Month':
                            month_id.className += " active"
                            //get user accounts to look for
                            $scope.users_in_firm = user_ids_to_look = user_ids.split(";")
                            
                            //get transactions that are applicable for accounts
                            user_transactions = []

                            for(i=0;i<user_ids_to_look.length;i++){
                                for(i=0;i<transactions.length;i++){
                                    current_transaction = transactions[i]
                                    current_user_id = user_ids_to_look[i]
                                    if(current_transaction.Account.id == current_user_id){
                                        user_transactions.push(current_transaction)
                                    }
                                }
                            }

                            // get trades in proper time frame
                            time_satisfied_transactions = []
                            //get last week
                            var day = new Date();
                            var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                            var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 30));
                            //If nextWeek is smaller (earlier) than the value of the input date, alert...
                            for (var i = 0; i<user_transactions.length; i++){
                                var transaction_date = user_transactions[i].Date_Time.split('-');
                                year = transaction_date[0];
                                month = transaction_date[1];
                                day = transaction_date[2].split('T')[0];

                                if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                        time_satisfied_transactions.push(user_transactions[i])
                                }
                            }
                            $scope.member_info_to_table = []
                            //get users and accounts
                            users_from_api = $http.get(url_users, {cache: false});
                            user_accounts = $http.get(url_accounts, {cache: false});

                            $q.all([users_from_api, user_accounts]).then(function(values) {
                                users_from_api = values[0].data
                                user_accounts = values[1].data
                                
                                // for each account, log transactions in .transactions property
                                angular.forEach (user_accounts, (current_account, key) => {
                                    member_info = {}
                                    console.log(current_account+"{"+user_accounts.length+"}")
                                    accounts_transactions = []
                                    current_id = current_account.id
                                    accounts_user_id = current_account.User

                                    // loop through all transactions and give ones to match to the user account to a varibale
                                    for(i=0; i<time_satisfied_transactions.length;i++){
                                        
                                        if (time_satisfied_transactions[i].Account == current_id){
                                            accounts_transactions.push(time_satisfied_transactions[i])
                                        }
                                    }

                                    //match user id to user account's user id
                                    for(i=0;i<users_from_api.length;i++){
                                        current_user = users_from_api[i]
                                        //if match found
                                        if(current_user.id == accounts_user_id){
                                            member_info = new Object()
                                            member_info["username"] = current_user.username
                                            pct_difference = (parseFloat(accounts_transactions[0].Balance_at_Time) - parseFloat(user_accounts[i].Money)) / parseFloat(accounts_transactions[0].Balance_at_Time)
                                            member_info["change"] = pct_difference
                                            member_info["current_balance"] = user_accounts[i].Money
                                            $scope.member_info_to_table.push(member_info)
                                            continue
                                        }
                                    }
                                });
                                

                            
                            console.log($scope.member_info_to_table)
                            $scope.show_firm_table = true
                            });

                            
                            break;
                        case 'Week':
                            week_id.className += " active"
                            //get user accounts to look for
                            $scope.users_in_firm = user_ids_to_look = user_ids.split(";")
                            
                            //get transactions that are applicable for accounts
                            user_transactions = []

                            for(i=0;i<user_ids_to_look.length;i++){
                                for(i=0;i<transactions.length;i++){
                                    current_transaction = transactions[i]
                                    current_user_id = user_ids_to_look[i]
                                    if(current_transaction.Account.id == current_user_id){
                                        user_transactions.push(current_transaction)
                                    }
                                }
                            }

                            // get trades in proper time frame
                            time_satisfied_transactions = []
                            //get last week
                            var day = new Date();
                            var today = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                            var last_week = Date.parse(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 7));
                            //If nextWeek is smaller (earlier) than the value of the input date, alert...
                            for (var i = 0; i<user_transactions.length; i++){
                                var transaction_date = user_transactions[i].Date_Time.split('-');
                                year = transaction_date[0];
                                month = transaction_date[1];
                                day = transaction_date[2].split('T')[0];

                                if (last_week <= Date.parse(new Date(year, month, day)) <= today){
                                        time_satisfied_transactions.push(user_transactions[i])
                                }
                            }
                            $scope.member_info_to_table = []
                            //get users and accounts
                            users_from_api = $http.get(url_users, {cache: false});
                            user_accounts = $http.get(url_accounts, {cache: false});

                            $q.all([users_from_api, user_accounts]).then(function(values) {
                                users_from_api = values[0].data
                                user_accounts = values[1].data
                                
                                // for each account, log transactions in .transactions property
                                angular.forEach (user_accounts, (current_account, key) => {
                                    member_info = {}
                                    console.log(current_account+"{"+user_accounts.length+"}")
                                    accounts_transactions = []
                                    current_id = current_account.id
                                    accounts_user_id = current_account.User

                                    // loop through all transactions and give ones to match to the user account to a varibale
                                    for(i=0; i<time_satisfied_transactions.length;i++){
                                        
                                        if (time_satisfied_transactions[i].Account == current_id){
                                            accounts_transactions.push(time_satisfied_transactions[i])
                                        }
                                    }

                                    //match user id to user account's user id
                                    for(i=0;i<users_from_api.length;i++){
                                        current_user = users_from_api[i]
                                        //if match found
                                        if(current_user.id == accounts_user_id){
                                            member_info = new Object()
                                            member_info["username"] = current_user.username
                                            pct_difference = (parseFloat(accounts_transactions[0].Balance_at_Time) - parseFloat(user_accounts[i].Money)) / parseFloat(accounts_transactions[0].Balance_at_Time)
                                            member_info["change"] = pct_difference
                                            member_info["current_balance"] = user_accounts[i].Money
                                            $scope.member_info_to_table.push(member_info)
                                            continue
                                        }
                                    }
                                });
                                

                            
                            console.log($scope.member_info_to_table)
                            $scope.show_firm_table = true
                            });

                            break;
                    }
                    
                     return               
                }).error(function(error){
                    console.log(error);
                    });
                
            
    }

    $scope.getNewsHeadlines = function(){
        ticker = document.getElementById("searchFinancialNewsTicker").value
        BrokerAPI.getNewsHeadlines(ticker).then((data) => {
            headlines = data.data
            console.log(headlines)
        }).error((error) => {console.log(error)})
    }
    
});