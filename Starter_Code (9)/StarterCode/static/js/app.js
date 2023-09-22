//Use the D3 library to read in samples.json from the URL

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

d3.json(url).then((data) => {
    let samples = data.samples;
    let sampleNames = data.names;
    let sample = sampleNames[0];

    console.log(data) 
    console.log(samples)
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    console.log(result)
    let otu_ids = result.otu_ids;
    
  
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });

//Create a bubble chart that displays each sample

d3.json(url).then((data) => {
  let samples = data.samples;
  let sampleNames = data.names;
  let sample = sampleNames[0];

  let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  let result = resultArray[0];

  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;
  let sample_values = result.sample_values;

  let bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
  ];

  let bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    showlegend: false,
    height: 600,
    width: 1000
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
});

//Display the sample metadata, i.e., an individual's demographic information && Display each key-value pair from the metadata JSON object somewhere on the page

d3.json(url).then((data) => {
  let samples = data.samples;
  let sampleNames = data.names;
  let dropdown = d3.select("#selDataset");

  //Dropdown with sample names

  sampleNames.forEach(sample => {
    dropdown.append("option").text(sample).property("value", sample);
  });

  //Update all the plots when a new sample is selected

  function updatePlots(selectedSample) {
    let resultArray = samples.filter(sampleObj => sampleObj.id == selectedSample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let sampleMetadata = d3.select("#sample-metadata");

    //Clear existing content in the sample metadata

    sampleMetadata.html("");

    //Iterate over the key-value pairs in the metadata and display them on the page

    let metadataArray = data.metadata.filter(metadataObj => metadataObj.id == selectedSample);
    let metadataResult = metadataArray[0];
    Object.entries(metadataResult).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
        }
      }
    ];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" },
      showlegend: false,
      height: 600,
      width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  //Event handler for sample selection

  function optionChanged(selectedSample) {
    updatePlots(selectedSample);
  }

  //Initialize the page with the first sample

  let initialSample = sampleNames[0];
  updatePlots(initialSample);

  //Event listener for sample selection

  dropdown.on("change", function () {
    let selectedSample = dropdown.property("value");
    updatePlots(selectedSample);
  });
});
