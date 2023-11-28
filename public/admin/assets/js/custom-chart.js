(function ($) {
    "use strict";
    // Assuming you have a function called processData
// const processedData = processData(monthlySalesArray);
let monthlySalesArray = document.getElementById("monthlySalesArray").value;

monthlySalesArray = monthlySalesArray.trim(); // Remove leading and trailing whitespace
monthlySalesArray = monthlySalesArray.split(',')
monthlySalesArray = monthlySalesArray.map((item)=> Number(item))
monthlySalesArray = Array(monthlySalesArray);
monthlySalesArray = monthlySalesArray[0]


let productsPerMonth = document.getElementById("productsPerMonth").value;

productsPerMonth = productsPerMonth.trim(); // Remove leading and trailing whitespace
productsPerMonth = productsPerMonth.split(',')
productsPerMonth = productsPerMonth.map((item)=> Number(item))
productsPerMonth = Array(productsPerMonth);
productsPerMonth = productsPerMonth[0]


 // Output: object (assuming the parsed result is an array)

    if ($('#myChart').length) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: monthlySalesArray
                    },
                    {
                        label: 'Products',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(380, 200, 230, 0.2)',
                        borderColor: 'rgb(380, 200, 230)',
                        data: productsPerMonth
                    }

                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                }
            }
        });
    } //End if

    /*Sale statistics Chart*/
  
    
})(jQuery);


let orderStatusArray = document.getElementById("orderStatusArray").value;

orderStatusArray = orderStatusArray.trim(); // Remove leading and trailing whitespace
orderStatusArray = orderStatusArray.split(',')
orderStatusArray = orderStatusArray.map((item)=> Number(item))
orderStatusArray = Array(orderStatusArray);
orderStatusArray = orderStatusArray[0]
console.log(orderStatusArray)

// Sample data for the polar area chart
            const polarData = {
                labels: ['Delivered', 'Pending', 'Cancelled', 'Out For Delivery'],
                datasets: [{
                    data: orderStatusArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                }],
            };

            // Configuration options for the polar area chart
            const polarOptions = {
                scale: {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            };

            // Get the canvas element for the polar area chart
            const ctx2 = document.getElementById('myChart2').getContext('2d');

            // Create the polar area chart
            const myChart2 = new Chart(ctx2, {
                type: 'polarArea',
                data: polarData,
                options: polarOptions,
            });