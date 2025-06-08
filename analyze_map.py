#!/usr/bin/env python3
"""
Safari Zone Map Analysis Script
Analyzes the map.png to create a grid-based coordinate system for the game.
"""

import numpy as np
from PIL import Image
import json

def analyze_map():
    # Load the map image
    img = Image.open('public/map.png')
    width, height = img.size
    img_array = np.array(img)
    
    print(f"Map dimensions: {width}x{height}")
    
    # Create a grid system (16x16 tiles seems appropriate for this map)
    grid_size = 16
    grid_width = width // grid_size
    grid_height = height // grid_size
    
    print(f"Grid system: {grid_width}x{grid_height} cells of {grid_size}px each")
    
    # Define color ranges for different terrain types
    def get_terrain_type(rgb):
        r, g, b = rgb[:3]  # Ignore alpha if present
        
        # Water (blue tones)
        if b > 150 and b > r and b > g:
            return 'water'
        
        # Trees/Forest (dark green)
        elif g > 100 and g > r and g > b and r < 100:
            return 'forest'
        
        # Sandy/Desert areas (yellow/tan)
        elif r > 180 and g > 150 and b < 120:
            return 'desert'
        
        # Rocky/Mountain areas (brown/gray)
        elif r > 100 and g < 120 and b < 120 and abs(r-g) < 30:
            return 'mountain'
        
        # Grass areas (light green)
        elif g > r and g > b and g > 120:
            return 'grass'
        
        # Buildings/structures (varied colors but usually distinct)
        elif (r > 150 and g < 100 and b < 100) or (r < 100 and g < 100 and b > 150):
            return 'building'
        
        # Default to grass for unknown
        else:
            return 'grass'
    
    # Analyze the map grid
    grid_data = []
    area_boundaries = {
        'center': {'x_min': grid_width//4, 'x_max': 3*grid_width//4, 'y_min': grid_height//4, 'y_max': 3*grid_height//4},
        'west': {'x_min': 0, 'x_max': grid_width//2, 'y_min': 0, 'y_max': grid_height},
        'east': {'x_min': grid_width//2, 'x_max': grid_width, 'y_min': 0, 'y_max': grid_height},
        'north': {'x_min': 0, 'x_max': grid_width, 'y_min': 0, 'y_max': grid_height//2}
    }
    
    terrain_counts = {'water': 0, 'forest': 0, 'desert': 0, 'mountain': 0, 'grass': 0, 'building': 0}
    
    for grid_y in range(grid_height):
        row = []
        for grid_x in range(grid_width):
            # Sample the center pixel of each grid cell
            pixel_x = grid_x * grid_size + grid_size // 2
            pixel_y = grid_y * grid_size + grid_size // 2
            
            # Ensure we don't go out of bounds
            pixel_x = min(pixel_x, width - 1)
            pixel_y = min(pixel_y, height - 1)
            
            pixel_color = img_array[pixel_y, pixel_x]
            terrain = get_terrain_type(pixel_color)
            terrain_counts[terrain] += 1
            
            # Determine which area this grid cell belongs to
            area = 'center'  # default
            if grid_x < grid_width // 3:
                area = 'west'
            elif grid_x > 2 * grid_width // 3:
                area = 'east'
            elif grid_y < grid_height // 3:
                area = 'north'
            
            cell_data = {
                'x': grid_x,
                'y': grid_y,
                'terrain': terrain,
                'area': area,
                'pixel_x': pixel_x,
                'pixel_y': pixel_y,
                'walkable': terrain in ['grass', 'desert'],  # Define walkable areas
                'spawnable': terrain in ['grass', 'forest', 'desert']  # Where Pokemon can spawn
            }
            row.append(cell_data)
        grid_data.append(row)
    
    # Find buildings/landmarks
    buildings = []
    for y, row in enumerate(grid_data):
        for x, cell in enumerate(row):
            if cell['terrain'] == 'building':
                buildings.append({
                    'x': x,
                    'y': y,
                    'type': 'safari_building',
                    'area': cell['area']
                })
    
    # Generate map configuration
    map_config = {
        'dimensions': {'width': grid_width, 'height': grid_height},
        'cell_size': grid_size,
        'image_size': {'width': width, 'height': height},
        'terrain_distribution': terrain_counts,
        'buildings': buildings,
        'areas': {
            'center': {
                'bounds': {'x_min': grid_width//3, 'x_max': 2*grid_width//3, 'y_min': grid_height//3, 'y_max': 2*grid_height//3},
                'primary_terrain': 'grass',
                'description': 'Central grasslands with Safari Zone entrance'
            },
            'west': {
                'bounds': {'x_min': 0, 'x_max': grid_width//3, 'y_min': 0, 'y_max': grid_height},
                'primary_terrain': 'forest',
                'description': 'Dense forest area with rare Pokemon'
            },
            'east': {
                'bounds': {'x_min': 2*grid_width//3, 'x_max': grid_width, 'y_min': 0, 'y_max': grid_height},
                'primary_terrain': 'water',
                'description': 'Water areas and coastal regions'
            },
            'north': {
                'bounds': {'x_min': 0, 'x_max': grid_width, 'y_min': 0, 'y_max': grid_height//3},
                'primary_terrain': 'mountain',
                'description': 'Rocky mountains and desert regions'
            }
        }
    }
    
    # Save the grid data and configuration
    with open('src/data/mapGrid.json', 'w') as f:
        json.dump({
            'config': map_config,
            'grid': grid_data
        }, f, indent=2)
    
    print("\nTerrain Distribution:")
    for terrain, count in terrain_counts.items():
        percentage = (count / (grid_width * grid_height)) * 100
        print(f"  {terrain}: {count} cells ({percentage:.1f}%)")
    
    print(f"\nFound {len(buildings)} buildings/landmarks")
    print(f"Grid data saved to src/data/mapGrid.json")
    
    return map_config, grid_data

if __name__ == "__main__":
    analyze_map()