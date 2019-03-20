# Home Values

Look up Zillow home ID with `ZWSID`

```sh
https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<ZWSID>&address=2xxx+s+white+pine+place&citystatezip=83706
```

Use retrieved `zpid` to `POST` query to

```
https://www.zillow.com/graphql/
```

```json
{
   "operationName": "HomeValueChartDataQuery",
   "variables": {
      "zpid": <zpid>,
      "timePeriod": "TEN_YEARS",
      "metricType": "LOCAL_HOME_VALUES",
      "forecast": false
   },
   "query": "query HomeValueChartDataQuery($zpid: ID!,$metricType: HomeValueChartMetricType, $timePeriod: HomeValueChartTimePeriod) { property(zpid:$zpid) {\n homeValueChartData(metricType: $metricType, timePeriod:$timePeriod) {\n points {\n x\n y\n }\n name\n }\n }\n}\n",
   "clientVersion": "home-details/5.42.0.0.0.hotfix-2019-03-15.ded1540"
}
```

## License

Copyright &copy; 2019 Jason Abbott

This software is licensed under the MIT license. See the [LICENSE](./LICENSE) file
accompanying this software for terms of use.
