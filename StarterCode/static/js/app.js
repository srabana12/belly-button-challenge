const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to update the plots based on the selected sample
function updatePlots(sampleIndex) {
  d3.json(url).then(function(data) {
    // Retrieve the data for the selected sample
    let sampleData = data.samples[sampleIndex];
    let otu_ids = sampleData.otu_ids;
    let sample_values = sampleData.sample_values;
    let otu_labels = sampleData.otu_labels;

    // Retrieve the metadata for the selected sample
    let metadata = data.metadata[sampleIndex];
    let washingFrequency = metadata.wfreq || 0;

    // Select the metadata div element
    let metadataDiv = d3.select("#sample-metadata");

    // Clear any existing metadata
    metadataDiv.html("");

    // Append each key-value pair in the metadata to the div
    Object.entries(metadata).forEach(function([key, value]) {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });

    // Update the bar chart
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
      type: "bar",
      orientation: "h",
      hovertext: otu_labels.slice(0, 10).reverse()
    };

    let data1 = [trace1];

    Plotly.newPlot("bar", data1);

    // Update the bubble chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    let data2 = [trace2];

    Plotly.newPlot('bubble', data2);

    // Update the gauge chart
    let data3 = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washingFrequency,
          title: { text: "Belly Button Washing Frequency<br>(Scrubs per Week)" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "#f7f3eb" },
              { range: [1, 2], color: "#f3f1e5" },
              { range: [2, 3], color: "#e8e6c9" },
              { range: [3, 4], color: "#e4e9b0" },
              { range: [4, 5], color: "#d4e595" },
              { range: [5, 6], color: "#b7ce8b" },
              { range: [6, 7], color: "#86c080" },
              { range: [7, 8], color: "#85bc8b" },
              { range: [8, 9], color: "#7fb586" }
            ],
            threshold: {
              line: { color: "green", width: 4 },
              thickness: 0.75,
              value: washingFrequency
            }
          }
        }
      ];
  
      let layout3 = { width: 600, height: 400, margin: { t: 0, b: 0 } };
  
      Plotly.newPlot("gauge", data3, layout3);
    });
  }
  

// Function to handle dropdown selection change
function optionChanged(sampleName) {
  d3.json(url).then(function(data) {
    let sampleIndex = data.names.indexOf(sampleName);
    updatePlots(sampleIndex);
  });
}

// Fetch the JSON data
d3.json(url).then(function(data) {
  let names = data.names;

  // Select the dropdown menu
  let dropdown = d3.select("#selDataset");

  // Populate the dropdown options
  dropdown
    .selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });

  // Set the initial value for the dropdown
  let initialName = names[0];

  // Call the updatePlots function with the initial value
  d3.json(url).then(function(data) {
    let initialIndex = data.names.indexOf(initialName);
    updatePlots(initialIndex);
  });

  // Event listener for dropdown selection change
  dropdown.on("change", function() {
    let selectedName = dropdown.property("value");
    optionChanged(selectedName);
  });
});
