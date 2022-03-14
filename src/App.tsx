import React, { FC, useCallback, useEffect, useState } from 'react';
import './App.scss';

interface TitleProps {
  value: number;
  index: number;
  color?: string;
  direction?: string;
}

type Tiles = number[];

const Tile: FC<TitleProps> = ({ value, index, color, direction }) => {
  return (
    <span
      className="tile"
      data-direction={value && direction}
      data-tile={`tile-${index}`}
      style={{
        gridArea: `tile-${index}`,
        background: value ? color : '#93c0bb',
      }}
    >
      {value > 0 && value}
    </span>
  );
};

const randomTile = (tile: Tiles): Tiles => {
  const isFirstTime = tile.every((num) => num === 0);
  if (isFirstTime) {
    while (tile.filter((item) => item > 0).length < 2) {
      const randomIndex = Math.floor(Math.random() * 15);
      if (!tile[randomIndex]) {
        tile[randomIndex] = 2;
      }
    }

    return tile;
  }

  let randomIndex = Math.floor(Math.random() * 15);
  let added = false;
  while (!added) {
    if (!tile[randomIndex]) {
      tile[randomIndex] = 2;
      added = true;
    } else {
      randomIndex = Math.floor(Math.random() * 15);
    }
  }

  return tile;
};

const calculateVerticalTiles = (tiles: Tiles, down?: boolean): Tiles => {
  for (let index = 0; index <= 3; index++) {
    let currentColumnTiles = tiles.filter(
      (val, tileIndex) => tileIndex % 4 === index
    );

    let valuedTile = currentColumnTiles.filter((val) => val);
    valuedTile = valuedTile.map((val, index) => {
      if (val === valuedTile[index + 1]) {
        valuedTile[index + 1] = 0;
        return val * 2;
      }

      return val;
    });
    valuedTile = valuedTile.filter((val) => val);

    const fillerArrey: Tiles = new Array(4 - valuedTile.length).fill(0);

    currentColumnTiles = !down
      ? [...valuedTile, ...fillerArrey]
      : [...fillerArrey, ...valuedTile];

    let useIndex = 0;

    tiles = tiles.map((val, mapIndex) => {
      if (mapIndex % 4 === index) {
        const item = currentColumnTiles[useIndex];
        useIndex++;
        return item;
      } else {
        return val;
      }
    });
  }
  return tiles;
};

const calculateHorizontalTiles = (tiles: Tiles, right?: boolean): Tiles => {
  let maxCheckpointIndex = 0;
  let minCheckpointIndex = 0;

  for (let index = 0; index <= 3; index++) {
    minCheckpointIndex = maxCheckpointIndex;
    maxCheckpointIndex += 4;
    let currentRowTiles: Tiles = tiles.slice(
      minCheckpointIndex,
      maxCheckpointIndex
    );

    let valuedTile = currentRowTiles.filter((val) => val);
    valuedTile = valuedTile.map((val, index) => {
      if (val === valuedTile[index + 1]) {
        valuedTile[index + 1] = 0;
        return val * 2;
      }

      return val;
    });
    valuedTile = valuedTile.filter((val) => val);

    const fillerArrey: Tiles = new Array(4 - valuedTile.length).fill(0);

    currentRowTiles = !right
      ? [...valuedTile, ...fillerArrey]
      : [...fillerArrey, ...valuedTile];

    tiles = [
      ...tiles.slice(0, minCheckpointIndex),
      ...currentRowTiles,
      ...tiles.slice(maxCheckpointIndex, tiles.length),
    ];
  }
  return tiles;
};

function App() {
  // [0, 0, 0, 0,
  //  0, 0, 0, 0,
  //  0, 0, 0, 0];
  const [tileValues, setTileValues] = useState<Tiles>(
    randomTile([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  );
  const [direction, setDirection] = useState('');

  const colors: any = {
    2: '#1f5048',
    4: '#2d725e',
    8: '#d8fff9',
    16: '#b2fff3',
    32: '#1ece9f',
    64: '#6dff91',
    128: '#72ea8e',
    256: '#ea8572',
    512: '#ffc7be',
    1024: '#ffe3de',
    2048: '#ea7272',
  };

  const manipulateTiles = useCallback(
    (
      key: string,
      tile: Tiles,
      setter: (val: Tiles) => void,
      directionSetter: (val: string) => void
    ) => {
      let combined: Tiles;
      directionSetter(key);
      switch (key) {
        case 'ArrowUp':
          combined = calculateVerticalTiles(tile);
          setter(randomTile(combined));

          break;
        case 'ArrowDown':
          combined = calculateVerticalTiles(tile, true);
          setter(randomTile(combined));
          break;
        case 'ArrowLeft':
          combined = calculateHorizontalTiles(tile);
          setter(randomTile(combined));
          break;
        case 'ArrowRight':
          combined = calculateHorizontalTiles(tile, true);
          setter(randomTile(combined));
          break;
      }
    },
    []
  );

  const addEvent = (e: KeyboardEvent) => {
    manipulateTiles(e.key, tileValues, setTileValues, setDirection);
  };

  useEffect(() => {
    window.addEventListener('keydown', addEvent);

    return () => {
      window.removeEventListener('keydown', addEvent);
    };
  }, [tileValues]);

  const renderTile = useCallback(
    (tiles: Tiles) =>
      tiles.map((value, index) => (
        <Tile
          value={value}
          index={index}
          key={index}
          color={`#${value}ff`}
          direction={direction}
        />
      )),
    [tileValues]
  );

  return (
    <div className="App">
      <div className="container">
        <div className="game-box">{renderTile(tileValues)}</div>
      </div>
    </div>
  );
}

export default App;
