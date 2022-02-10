// Function for dropdown menu
function optionChanged(selectedID){
  
    // Check dropdown
    console.log(selectedID);
 
    // pull data via json file using d3
    d3.json("samples.json").then((data) => {
 
    console.log(data);
 
    // Clears dropdown
    d3.select("#selDataset").html("");   
    
    // loop thru Metadata array for each item append the item ID and adds ID to dropdown
    data.metadata.forEach(item =>
         {
          // console.log(item.id);
         d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
         });
    // Selected value 
    d3.select("#selDataset").node().value = selectedID;
    
    // dropdown for Metadata filter on selected ID's
    const idMetadata = data.metadata.filter(item=> (item.id == selectedID));
    
    // Check the metadata loaded for the selected ID
    console.log(idMetadata);
    
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");
    Object.entries(idMetadata[0]).forEach(item=> 
       {
          // console.log(item);
          panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
       });
 
    // BAR CHART
 
    // Filter sample array data for the selected ID
    const idSample = data.samples.filter(item => parseInt(item.id) == selectedID);
    
    
    // Slice top 10 sample values
    var sampleValue = idSample[0].sample_values.slice(0,10);
    sampleValue= sampleValue.reverse();
    var otuID = idSample[0].otu_ids.slice(0,10);
    otuID = otuID.reverse();
    var otuLabels = idSample[0].otu_labels
    otuLabels = otuLabels.reverse();
 
       // bar chart yAxis
    const yAxis = otuID.map(item => 'OTU' + " " + item);
       // console.log(yAxis);
    
    // Define trace object, layout, and color 
       const trace = {
       y: yAxis,
       x: sampleValue,
       type: 'bar',
       orientation: "h",
       text:  otuLabels,
       marker: {
          color: 'rgb(145,56,49)',
          line: {
             width: 3
         }
        }
       },
       layout = {
       title: 'Top 10 Operational Taxonomic Units (OTU)/Individual',
       xaxis: {title: 'Number of Samples Collected'},
       yaxis: {title: 'Operational Taxonomic Unit IDs'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true});    
       
 // BB CHART
 
 // Remove from individual
 var sampleValue1 =idSample[0].sample_values;
 var otuID1= idSample[0].otu_ids;
 
 // Define trace object, layout, and color
 const trace1 = {
    x: otuID1,
    y: sampleValue1,
    mode: 'markers',
    marker: {
      color: otuID1,
      
      size: sampleValue1
    }
  },
 
  layout1 = {
    title: '<b style="color: #913831;">Bubble Chart For Each Sample</b>',
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'Number of Samples Collected'},
    showlegend: false,
    height: 600,
    width: 1200
    };
    
 // Plot using Plotly
 Plotly.newPlot('bubble', [trace1], layout1);
 
 // BONUS: GAUGE CHART

 // Plot weekly Freq Gauge Chart 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 
 const washFreq = idMetadata[0].wfreq;
 
 const guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
      type: "indicator",
      mode: "gauge+number",     
       gauge: {
       axis: { range: [0,9],},
       bar: { color: "#f2e9e4" },
       steps: [
          { range: [0, 1], color: "#FAA0A0"},
          { range: [1, 2], color: "#F88379"},
          { range: [2, 3], color: "#EE4B2B"},
          { range: [3, 4], color: "#FF3131"},
          { range: [4, 5], color: "#FF0000"},
          { range: [5, 6], color: "#880808"},
          { range: [6, 7], color: "#AA4A44"},
          { range: [7, 8], color: "#DC143C"},
          { range: [8, 9], color: "#F88379"}
        
        ],
       threshold: {
          value: washFreq
        }
      }
    }
  ]; 
  const gaugeLayout = {  width: 600, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plotly plot
  Plotly.newPlot('gauge', guageData, gaugeLayout); 
 
 });
 }
 
 // Test Subject ID 940-1601
 optionChanged(940);
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
 optionChanged(d3.event.target.value);
 
 });