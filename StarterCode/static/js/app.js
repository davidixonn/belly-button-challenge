const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize dashboard at start up 
function init() {

    // Use D3 to select dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for sample names
        let names = data.names;

        // Add samples to dropdown menu
        names.forEach((id) => {

            // Log value of id for each iteration of loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set first sample from list
        let first_sample = names[0];

        // Log the value of first sample
        console.log(first_sample);

        // Build initial plots
        buildMetadata(first_sample);
        buildBarChart(first_sample);
        buildBubbleChart(first_sample);
        buildGaugeChart(first_sample);

    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on value of sample
        let value = metadata.filter(result => result.id == sample);

        // Log array of metadata objects after filter
        console.log(value)

        // Get first index from array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log individual key/value pairs as appended to metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that builds bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get first index from array
        let valueData = value[0];

        // Get otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log data to console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup layout
        let layout = {
            title: "Top 10 Present OTUs"
        };

        // Call Plotly to plot bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on value of sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get first index from array
        let valueData = value[0];

        // Get otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log data to console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up layout
        let layout = {
            title: "Bacteria For Each Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample changes
function optionChanged(value) { 

    // Log new values
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call initialize function
init();
