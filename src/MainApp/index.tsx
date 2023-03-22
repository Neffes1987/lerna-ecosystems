import React from 'react';
import { ModuleA } from '@components/modulea';
import { ModuleB } from '@components/moduleb';

export const App = (): React.ReactElement => (
  <div>
    MAIN MODULE

    <ModuleA />

    <ModuleB />
  </div>
);
