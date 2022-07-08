(function () {
    var myConnector = tableau.makeConnector();

myConnector.getSchema = function(schemaCallback) {

        var cols = [{
            id: "Timestamp",
            alias: "timestamp",
            dataType: "string"
        },{
            id: "RasterId",
            alias: "Raster_Id",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "SubscriberCount",
            alias: "Count",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "DensityScore",
            alias: "Score",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "Age_1",
            alias: "age1",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "Age_2",
            alias: "age2",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "Age_3",
            alias: "age3",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "Age_4",
            alias: "age4",
            dataType: tableau.dataTypeEnum.float
        },        
        {
            id: "Age_5",
            alias: "age5",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "Male",
            alias: "male",
            dataType: tableau.dataTypeEnum.float
        },
                {
            id: "Female",
            alias: "female",
            dataType: tableau.dataTypeEnum.float
        },];

        var tableInfo = {
            id: "density",
            alias: "density_scores",
            columns: cols,
            incrementColumnId: "Timestamp"
        };

        schemaCallback([tableInfo]);
    };


    myConnector.getData = function (table, doneCallback) {

        var lastId = parseInt(table.incrementValue || -1);

        $.ajax({
            headers: {
                Accept: "application/json",
                "apiKey":"l780f02009f546475a8ef7c54f7ea941d6",
                //"apiKey":"l7baaf07efff9944b6a18f1dcf3907ae4b",
                //"Access-Control-Allow-Origin": "http://127.0.0.1:8888",
                "Content-Type":"application/json",
                },
            type:"POST",
            data: JSON.stringify({"geometry":
                {"type":"Polygon",
                "coordinates":[
    [
      [
        13.5961365,
        47.9575068
      ],
      [
        13.5638642,
        47.953828
      ],
      [
        13.5569978,
        47.9414101
      ],
      [
        13.539145,
        47.9418701
      ],
      [
        13.5233521,
        47.9354301
      ],
      [
        13.5109925,
        47.9262286
      ],
      [
        13.5171723,
        47.8999956
      ],
      [
        13.5109925,
        47.8755915
      ],
      [
        13.5844636,
        47.868222
      ],
      [
        13.6139893,
        47.8963127
      ],
      [
        13.6105561,
        47.9294493
      ],
      [
        13.5961365,
        47.9575068
      ]
    ]
  ]
                }
            }),
            url: "https://api.drei.com/motion-insights/density/1.0/rasters/density",
            //"http://localhost:8010/proxy/motion-insights/density/1.0/rasters/density",
        //?rasterIds=250mN11231E19170&rasterIds=250mN11232E19174&rasterIds=250mN11232E19175&rasterIds=250mN11232E19176&rasterIds=250mN11232E19177&rasterIds=250mN11233E19173&rasterIds=250mN11233E19174&rasterIds=250mN11233E19175&rasterIds=250mN11233E19176&rasterIds=250mN11233E19177&rasterIds=250mN11233E19178&rasterIds=250mN11234E19173&rasterIds=250mN11234E19174&rasterIds=250mN11234E19175&rasterIds=250mN11234E19176&rasterIds=250mN11234E19177&rasterIds=250mN11234E19178&rasterIds=250mN11234E19179&rasterIds=250mN11235E19173&rasterIds=250mN11235E19174&rasterIds=250mN11235E19175&rasterIds=250mN11235E19176&rasterIds=250mN11235E19177&rasterIds=250mN11235E19178&rasterIds=250mN11235E19179&rasterIds=250mN11236E19173&rasterIds=250mN11236E19174&rasterIds=250mN11236E19175&rasterIds=250mN11236E19176&rasterIds=250mN11236E19177&rasterIds=250mN11236E19178&rasterIds=250mN11236E19179&rasterIds=250mN11237E19173&rasterIds=250mN11237E19174&rasterIds=250mN11237E19175&rasterIds=250mN11237E19176&rasterIds=250mN11237E19177&rasterIds=250mN11237E19178&rasterIds=250mN11238E19174&rasterIds=250mN11238E19175&rasterIds=250mN11238E19176&rasterIds=250mN11238E19177",

        success: function(res) {

            var feat = res.rasters
            tableData = [];

            var today = new Date();

            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            var dateTime = date+' '+time;


            for (var i = 0, len = feat.length; i < len; i++) {

                tableData.push({
                    "Timestamp": dateTime,
                    "RasterId": feat[i].rasterId,
                    "DensityScore": feat[i].density.score,
                    "SubscriberCount": feat[i].subscriberCount,
                    "Age_1": feat[i].ageGroups[0].percentage,
                    "Age_2": feat[i].ageGroups[1].percentage,
                    "Age_3": feat[i].ageGroups[2].percentage,
                    "Age_4": feat[i].ageGroups[3].percentage,
                    "Age_5": feat[i].ageGroups[4].percentage,
                    "Male": feat[i].genderDistribution.malePercentage,
                    "Female": feat[i].genderDistribution.femalePercentage,
                });

            }

            table.appendRows(tableData);
            doneCallback();

        },
    });
    
    }
        tableau.registerConnector(myConnector);

})();

$(document).ready(function () {
    $("#submitButton").click(function () {
    tableau.connectionName = "Drei Density API";
    tableau.submit()
    });
});