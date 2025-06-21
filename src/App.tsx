import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataManagementPlatform } from './components/DataManagementPlatform';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <DataManagementPlatform />
        <Toaster />
      </div>
    </DndProvider>
  );
}

export default App;