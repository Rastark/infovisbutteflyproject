function main() {
  var numberOfButterflies = 10;
  var numberOfPositions = 10;
  var butterflies = [];
  var JSONConfigFile = "resources/configurations.json";

  // initializes the svg container
  var svgContainer = d3
    .select(".butterflies")
    .append("svg")
    .attr("width", 870)
    .attr("height", 800)
    .style("border", "1px solid black")
    .attr("transform", "translate(400,0)")
    .style("background-color", "rgba(246, 229, 63, 0.9)");

  // defines a set of data points
  var randomPoints = function () {
    var dataset = [];
    for (var i = 0; i < 10; i++) {
      var x = d3.randomUniform(0, 730)();
      var y = d3.randomUniform(0, 730)();
      dataset.push({ x: x, y: y });
    }
    return dataset;
  };

  // Butterfly class
  var Butterfly = {
    id: -1,
    positionId: -1,
    configurationId: -1,
    height: 100,
    width: 150,
    // initializes a butterfly
    initializeButterfly: function (id, configurationId, positionId) {
      this.id = id;
      this.positionId = positionId;
      this.configurationId = configurationId;
      this.createButterfly();
    },
    // initialize a butterfly importing an svg icon
    createButterfly: function () {
      if (this.configurationId === -1) {
        var x = randomPoints()[this.id].x;
        var y = randomPoints()[this.id].y;
      } else {
        var x = getPositionX(this.configurationId, this.positionId);
        var y = getPositionY(this.configurationId, this.positionId);
      }
      var butterfly = svgContainer
        .append("g")
        .attr("id", "butterfly" + this.id)
        .attr("class", "butterfly");
      // imports the icon from an svg file
      d3.xml("resources/butterfly.svg").then((data) => {
        butterfly.node().append(data.documentElement);
      });
      // after creation, moves the butterfly to the starting configuration
      butterfly.attr("transform", "translate(" + x + ", " + y + ")");
    },
    // moves the butterfly to the specified configuration
    moveButterfly: function (configurationId) {
      var butterfly = svgContainer.select("#butterfly" + this.id);
      var x = getPositionX(configurationId, this.positionId);
      var y = getPositionY(configurationId, this.positionId);
      butterfly
        .transition()
        .duration(500)
        .attr("transform", "translate(" + x + ", " + y + ")");
    },
  };

  // gets the x coordinate associated with the respective configuration id and position id
  function getPositionX(configurationId, positionId) {
    return butterflyConfig[configurationId][positionId].x;
  }

  // gets the y coordinate with associated with the respective configuration id and position id
  function getPositionY(configurationId, positionId) {
    return butterflyConfig[configurationId][positionId].y;
  }

  // clones the Butterfly object
  var cloneButterfly = function () {
    var newButterfly = {},
      prop;
    for (prop in Butterfly) {
      if (Butterfly.hasOwnProperty(prop)) {
        newButterfly[prop] = Butterfly[prop];
      }
    }
    return newButterfly;
  };

  document.addEventListener("keydown", keyPressed);
  // moves all butterflies to the positions specified by the configuration associated with the pressed key
  function keyPressed(e) {
    keyName = event.key;
    if (keyName == "c") {
      for (var i = 0; i < numberOfButterflies; i++) {
        butterflies[i].moveButterfly(0);
      }
    }
    if (keyName == "i") {
      for (var i = 0; i < numberOfButterflies; i++) {
        butterflies[i].moveButterfly(1);
      }
    }
    if (keyName == "a") {
      for (var i = 0; i < numberOfButterflies; i++) {
        butterflies[i].moveButterfly(2);
      }
    }
    if (keyName == "o") {
      for (var i = 0; i < numberOfButterflies; i++) {
        butterflies[i].moveButterfly(3);
      }
    }
  }

  var butterflyConfig = [];
  // parses the JSON file and save the configurations in an object array
  d3.json(JSONConfigFile).then(function (data) {
    butterflyConfig = JSON.parse(JSON.stringify(data));
    // butterflies initialization
    for (var i = 0; i < numberOfButterflies; i++) {
      // initializes a butterfly into each position
      var positionId = i % numberOfPositions;
      // possible configurations:
      // (0) random initialization
      // (1) 'C' letter
      // (2) 'I' letter
      // (3) 'A' letter
      // (4) 'O' letter
      var configurationId = -1; // starting configuration id
      var newButterfly = cloneButterfly();
      newButterfly.initializeButterfly(i, configurationId, positionId);
      butterflies.push(newButterfly);
    }
  });
}
