// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-js';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      isHidden: true,
      needsApi: []
    },
    group: 'developer',
    icon: 'code',
    name: 'js',
    text: t('nav.js', 'JavaScript', { ns: 'apps-routing' })
  };
}
