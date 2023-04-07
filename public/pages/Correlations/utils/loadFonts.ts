/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export async function loadFontAwesome() {
  // create an array with nodes
  const nodes = [
    {
      id: 1,
      label: 'User 1',
      group: 'users',
    },
    {
      id: 2,
      label: 'User 2',
      group: 'users',
    },
    {
      id: 3,
      label: 'Usergroup 1',
      group: 'usergroups',
    },
    {
      id: 4,
      label: 'Usergroup 2',
      group: 'usergroups',
    },
    {
      id: 5,
      label: 'Organisation 1',
      shape: 'icon',
      icon: {
        face: "'FontAwesome'",
        code: '\uf1ad',
        size: 50,
        color: '#f0a30a',
      },
    },
  ];

  // Decent browsers: Make sure the fonts are loaded.
  return document.fonts
    .load('normal normal 400 24px/1 "FontAwesome"')
    .catch(console.error.bind(console, 'Failed to load Font Awesome 4.'));
}
