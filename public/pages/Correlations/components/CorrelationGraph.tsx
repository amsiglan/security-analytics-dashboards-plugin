/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState, useEffect } from 'react';
import $ from 'jquery';
import Graph from 'react-graph-vis';

// const nodes = [
//   { id: 1, label: 'Node 1' },
//   { id: 2, label: 'Node 2' },
//   { id: 3, label: 'Node 3' },
//   { id: 4, label: 'Node 4' },
//   { id: 5, label: 'Node 5' }
// ];

// const edges = [
//   { from: 1, to: 3 },
//   { from: 1, to: 2 },
//   { from: 2, to: 4 },
//   { from: 2, to: 5 }
// ];

// const options = {
//   layout: { randomSeed: 2 },
//   interaction:{
//       hover: true,
//       multiselect: true
//   },
//   physics: {
//     stabilization: {
//       fit: true,
//       iterations: 1000,
//     },
//   },
//   height: '1000px'
// };

export const CorrelationGraph = ({ graph: { nodes, edges }, options, events }) => {
  const makeMeMultiSelect = useCallback((container: JQuery<HTMLElement>, network, nodes) => {
    const NO_CLICK = 0;
    const LEFT_CLICK = 1;
    // const RIGHT_CLICK = 3;

    // Disable default right-click dropdown menu
    container[0].oncontextmenu = () => false;

    // State

    let drag = false,
      DOMRect = {};

    // Selector

    const canvasify = (DOMx, DOMy) => {
      const { x, y } = network.DOMtoCanvas({ x: DOMx, y: DOMy });
      return [x, y];
    };

    const correctRange = (start, end) => (start < end ? [start, end] : [end, start]);

    const selectFromDOMRect = () => {
      const [sX, sY] = canvasify(DOMRect.startX, DOMRect.startY);
      const [eX, eY] = canvasify(DOMRect.endX, DOMRect.endY);
      const [startX, endX] = correctRange(sX, eX);
      const [startY, endY] = correctRange(sY, eY);

      // network.selectNodes();
      const selectedNodes = nodes.reduce((selected, current) => {
        const { x, y } = network.getPositions(current.id)[current.id];
        return startX <= x && x <= endX && startY <= y && y <= endY
          ? selected.concat(current)
          : selected;
      }, []);
      if (selectedNodes.length > 0) {
        setFilteredNodes(selectedNodes);
      }
    };

    // Listeners
    container.off();
    container.on('mousedown', function ({ which, offsetX, offsetY }) {
      // When mousedown, save the initial rectangle state
      if (which === LEFT_CLICK) {
        Object.assign(DOMRect, {
          startX: offsetX,
          startY: offsetY,
          endX: offsetX,
          endY: offsetY,
        });
        drag = true;
      }
    });

    container.on('mousemove', function ({ which, offsetX, offsetY }) {
      // Make selection rectangle disappear when accidently mouseupped outside 'container'
      if (which === NO_CLICK && drag) {
        drag = false;
        network.redraw();
      }
      // When mousemove, update the rectangle state
      else if (drag) {
        Object.assign(DOMRect, {
          endX: offsetX,
          endY: offsetY,
        });
        network.redraw();
      }
    });

    container.on('mouseup', function ({ which }) {
      // When mouseup, select the nodes in the rectangle
      if (which === LEFT_CLICK) {
        drag = false;
        network.redraw();
        selectFromDOMRect();
      }
    });

    // Drawer

    network.on('afterDrawing', (ctx) => {
      if (drag) {
        const [startX, startY] = canvasify(DOMRect.startX, DOMRect.startY);
        const [endX, endY] = canvasify(DOMRect.endX, DOMRect.endY);

        ctx.setLineDash([5]);
        ctx.strokeStyle = 'rgba(78, 146, 237, 0.75)';
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(151, 194, 252, 0.45)';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
      }
    });
  }, []);

  const [network, setNetwork] = useState<any>(undefined);
  const [filteredNodes, setFilteredNodes] = useState(nodes);
  const container = $('#network');
  useEffect(() => {
    if (network) {
      makeMeMultiSelect(container, network, filteredNodes);
    }
  }, [network, filteredNodes]);

  return (
    <Graph
      identifier="network"
      graph={{ nodes: filteredNodes, edges }}
      options={options}
      events={events}
      getNetwork={(nw) => setNetwork(nw)}
    />
  );
};
