angular
    .module("API")
    .factory("BrokerAPI",function($http){
        function getStock(ticker){
            var day = new Date();
            var today = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            var year_from_today = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 365);
                        
            var url = 'http://query.yahooapis.com/v1/public/yql';
            var data = encodeURIComponent(
                "select * from yahoo.finance.quotes where symbol in ('" + ticker + "')");
            url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
            return $http.get(url)
        }

        function getHistoricalGraphData(ticker){
            console.log("^^^")

            var url = 'http://query.yahooapis.com/v1/public/yql';
            var data = encodeURIComponent(
                "select * from yahoo.finance.historicaldata where symbol in ('" + ticker + "') and startDate = '"
                                +year_from_today.getFullYear()+"-"+year_from_today.getMonth()+"-"+year_from_today.getDate()
                                +"' and endDate = '"+today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate()+"'");

            url += '?q=' + data + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
            return $http.get(url)
        }

        function getTransactions(){
            // var url = "http://localhost:8000/api/transaction/?format=json"
            var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/api/transaction/?format=json"
            return $http.get(url)
        }

        function getUserAccounts(){
            // var url = "http://localhost:8000/api/useraccounts/?format=json"
            var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/api/useraccounts/?format=json"
            return $http.get(url)
        }

        function getUsers(){
            var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/api/user/?format=json"
            return $http.get(url)

        }

        function getNewsHeadlines(ticker){
            var url = "https://feeds.finance.yahoo.com/rss/2.0/headline?s="+ticker.toString()+"&region=US&lang=en-US"
            return $http.get(url)
        }

      

        return {
            getStock:getStock,
            getTransactions:getTransactions,
            getUserAccounts:getUserAccounts,
            getHistoricalGraphData:getHistoricalGraphData,
            getNewsHeadlines:getNewsHeadlines
        }
});