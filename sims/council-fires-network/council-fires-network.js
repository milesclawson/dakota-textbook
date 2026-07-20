// Council Fires Network — Očhéthi Šakówiŋ
// Interactive vis-network showing the Seven Council Fires and their dialect groupings
// CANVAS_HEIGHT: 560
// Bloom Level: Understand — explain how the Seven Council Fires relate to one another

document.addEventListener('DOMContentLoaded', function () {

  const nodes = new vis.DataSet([
    // Root node
    { id: 0, label: 'Očhéthi Šakówiŋ\nSeven Council Fires', shape: 'ellipse',
      color: { background: '#8B1A1A', border: '#5A0A0A', highlight: { background: '#A32020', border: '#8B1A1A' } },
      font: { color: 'white', size: 15, bold: true }, size: 40 },

    // Dakota group
    { id: 1, label: 'Dakota Group\n(Eastern)', shape: 'box',
      color: { background: '#4A90D9', border: '#2C6FAC' }, font: { color: 'white', size: 13 } },
    { id: 2, label: 'Bdewákhaŋthuŋwaŋ\nMdewakanton', shape: 'dot',
      color: { background: '#7AB8F0', border: '#4A90D9' }, font: { size: 12 } },
    { id: 3, label: 'Waȟpékhute\nWahpekute', shape: 'dot',
      color: { background: '#7AB8F0', border: '#4A90D9' }, font: { size: 12 } },
    { id: 4, label: 'Sisíthuŋwaŋ\nSisseton', shape: 'dot',
      color: { background: '#7AB8F0', border: '#4A90D9' }, font: { size: 12 } },
    { id: 5, label: 'Waȟpéthuŋwaŋ\nWahpeton', shape: 'dot',
      color: { background: '#7AB8F0', border: '#4A90D9' }, font: { size: 12 } },

    // Nakota group
    { id: 6, label: 'Nakota Group\n(Middle)', shape: 'box',
      color: { background: '#2E8B57', border: '#1A5C38' }, font: { color: 'white', size: 13 } },
    { id: 7, label: 'Iháŋkthuŋwaŋ\nYankton', shape: 'dot',
      color: { background: '#7FC99A', border: '#2E8B57' }, font: { size: 12 } },
    { id: 8, label: 'Iháŋkthuŋwaŋna\nYanktonai', shape: 'dot',
      color: { background: '#7FC99A', border: '#2E8B57' }, font: { size: 12 } },

    // Lakota group
    { id: 9, label: 'Lakota Group\n(Western)', shape: 'box',
      color: { background: '#C8860A', border: '#8B5E05' }, font: { color: 'white', size: 13 } },
    { id: 10, label: 'Thítȟuŋwaŋ\nTeton / Lakota', shape: 'dot',
      color: { background: '#F0C060', border: '#C8860A' }, font: { size: 12 } },
  ]);

  const edges = new vis.DataSet([
    // Root to groups
    { from: 0, to: 1, arrows: 'to', color: { color: '#4A90D9' }, width: 2 },
    { from: 0, to: 6, arrows: 'to', color: { color: '#2E8B57' }, width: 2 },
    { from: 0, to: 9, arrows: 'to', color: { color: '#C8860A' }, width: 2 },
    // Dakota members
    { from: 1, to: 2, arrows: 'to', color: { color: '#7AB8F0' } },
    { from: 1, to: 3, arrows: 'to', color: { color: '#7AB8F0' } },
    { from: 1, to: 4, arrows: 'to', color: { color: '#7AB8F0' } },
    { from: 1, to: 5, arrows: 'to', color: { color: '#7AB8F0' } },
    // Nakota members
    { from: 6, to: 7, arrows: 'to', color: { color: '#7FC99A' } },
    { from: 6, to: 8, arrows: 'to', color: { color: '#7FC99A' } },
    // Lakota members
    { from: 9, to: 10, arrows: 'to', color: { color: '#F0C060' } },
  ]);

  const container = document.getElementById('network-container');

  const options = {
    layout: { hierarchical: { direction: 'LR', sortMethod: 'directed', levelSeparation: 180, nodeSpacing: 90 } },
    physics: { enabled: false },
    interaction: { hover: true, tooltipDelay: 100, navigationButtons: false, keyboard: false },
    nodes: { borderWidth: 2, shadow: true, font: { face: 'Arial' } },
    edges: { smooth: { type: 'cubicBezier' } },
  };

  const network = new vis.Network(container, { nodes, edges }, options);

  // Info panel on click
  const info = document.getElementById('info-panel');
  const details = {
    0: { title: 'Očhéthi Šakówiŋ', body: 'The Seven Council Fires — the political and cultural alliance of seven related peoples. Decision-making was communal; leadership was earned through wisdom, bravery, and generosity.' },
    1: { title: 'Dakota Group (Eastern)', body: 'The four eastern fires. Dakota-speaking peoples lived in Minnesota\'s lakes and forests. This course teaches Eastern Dakota.' },
    2: { title: 'Bdewákhaŋthuŋwaŋ (Mdewakanton)', body: '"Spirit Lake Village." One of the four Dakota-speaking council fires, historically centered near Mille Lacs and the Mississippi River.' },
    3: { title: 'Waȟpékhute (Wahpekute)', body: '"Shooters among the Leaves." Historically lived in southern Minnesota and the Iowa border region.' },
    4: { title: 'Sisíthuŋwaŋ (Sisseton)', body: '"Village of the Swamp." Historically in northeastern South Dakota and western Minnesota.' },
    5: { title: 'Waȟpéthuŋwaŋ (Wahpeton)', body: '"Village in the Leaves." Historically in the Red River Valley area.' },
    6: { title: 'Nakota Group (Middle)', body: 'The two middle fires. The Nakota dialect bridges Eastern Dakota and Lakota.' },
    7: { title: 'Iháŋkthuŋwaŋ (Yankton)', body: '"Village at the End." Historically in southeastern South Dakota and Nebraska.' },
    8: { title: 'Iháŋkthuŋwaŋna (Yanktonai)', body: '"Little Village at the End." Historically in central South Dakota and North Dakota.' },
    9: { title: 'Lakota Group (Western)', body: 'The westernmost fire. The Lakota are the largest group and most widely known, historically living on the Great Plains.' },
    10: { title: 'Thítȟuŋwaŋ (Teton / Lakota)', body: '"Prairie Dwellers." The single western fire, comprising multiple bands including the Oglala, Brulé, and others.' },
  };

  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      const id = params.nodes[0];
      if (details[id]) {
        info.innerHTML = '<strong>' + details[id].title + '</strong><br>' + details[id].body;
        info.style.display = 'block';
      }
    } else {
      info.style.display = 'none';
    }
  });
});
