import React from 'react';
import { Box, Cone, Cylinder, Sphere } from '@react-three/drei';

interface ModelProps {
  type: string;
  color: string;
}

const description_person_extras = (type: string, height: number) => {
  if (type === 'grandpa') {
    return (
      <group>
        {/* Flat cap */}
        <Box args={[0.35, 0.05, 0.35]} position={[0, height * 1.1, 0]}>
          <meshStandardMaterial color="#444" />
        </Box>
        {/* Cane */}
        <Box args={[0.05, height * 0.7, 0.05]} position={[0.3, height * 0.35, 0.15]}>
          <meshStandardMaterial color="#5d4037" />
        </Box>
        <Box args={[0.15, 0.05, 0.05]} position={[0.25, height * 0.7, 0.15]}>
          <meshStandardMaterial color="#5d4037" />
        </Box>
      </group>
    );
  }
  if (type === 'grandma') {
    return (
      <group>
        {/* Hair bun - Larger and distinct */}
        <Box args={[0.25, 0.25, 0.25]} position={[0, height * 1.1, -0.1]}>
          <meshStandardMaterial color="#e9ecef" />
        </Box>
        {/* Shawl */}
        <Box args={[0.5, 0.25, 0.35]} position={[0, height * 0.75, 0]}>
          <meshStandardMaterial color="#b19cd9" transparent opacity={0.8} />
        </Box>
        {/* Skirt bottom */}
        <Box args={[0.5, 0.15, 0.35]} position={[0, height * 0.45, 0]}>
          <meshStandardMaterial color="#ff8fa3" />
        </Box>
      </group>
    );
  }
  if (type === 'man') {
    return (
      <group>
        {/* Short hair - clearly defined */}
        <Box args={[0.35, 0.1, 0.35]} position={[0, height * 1.1, 0]}>
          <meshStandardMaterial color="#2d2d2d" />
        </Box>
        {/* Neck Tie */}
        <Box args={[0.08, 0.35, 0.02]} position={[0, height * 0.65, 0.13]}>
          <meshStandardMaterial color="#cc0000" />
        </Box>
        {/* Briefcase */}
        <Box args={[0.1, 0.3, 0.4]} position={[0.3, height * 0.4, 0]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
      </group>
    );
  }
  if (type === 'woman') {
    return (
      <group>
        {/* Long hair */}
        <Box args={[0.4, 0.5, 0.35]} position={[0, height * 0.9, -0.1]}>
          <meshStandardMaterial color="#4a3728" />
        </Box>
        {/* Skirt bottom extension */}
        <Box args={[0.5, 0.2, 0.4]} position={[0, height * 0.45, 0]}>
          <meshStandardMaterial color="#ff8fa3" />
        </Box>
      </group>
    );
  }
  return null;
};

export const VoxelModel: React.FC<ModelProps> = ({ type, color }) => {
  switch (type) {
    case 'sakura_tree':
      return (
        <group>
          <Box args={[0.4, 1.5, 0.4]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#5d4037" />
          </Box>
          <Box args={[1.2, 1, 1.2]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#ffb7c5" transparent opacity={0.9} />
          </Box>
          <Box args={[0.8, 0.6, 0.8]} position={[0, 2.4, 0]}>
            <meshStandardMaterial color="#ffc0cb" />
          </Box>
        </group>
      );
    case 'torii':
      return (
        <group>
          <Box args={[0.2, 2, 0.2]} position={[-0.8, 1, 0]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[0.2, 2, 0.2]} position={[0.8, 1, 0]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[2.2, 0.2, 0.3]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[1.8, 0.2, 0.2]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
        </group>
      );
    case 'panda':
      return (
        <group>
          <Box args={[0.8, 0.6, 0.6]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="white" />
          </Box>
          <Box args={[0.2, 0.3, 0.2]} position={[-0.3, 0.15, 0.3]}>
            <meshStandardMaterial color="black" />
          </Box>
          <Box args={[0.2, 0.3, 0.2]} position={[0.3, 0.15, 0.3]}>
            <meshStandardMaterial color="black" />
          </Box>
          <Box args={[0.5, 0.5, 0.5]} position={[0, 0.7, 0.2]}>
            <meshStandardMaterial color="white" />
          </Box>
          {/* Ears */}
          <Box args={[0.15, 0.15, 0.1]} position={[-0.2, 0.95, 0.2]}>
            <meshStandardMaterial color="black" />
          </Box>
          <Box args={[0.15, 0.15, 0.1]} position={[0.2, 0.95, 0.2]}>
            <meshStandardMaterial color="black" />
          </Box>
        </group>
      );
    case 'fuji_mountain':
      return (
        <group>
          <Cone args={[3, 4, 4]} rotation={[0, Math.PI / 4, 0]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#3a5a8c" />
          </Cone>
          <Box args={[1.5, 1, 1.5]} position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
            <meshStandardMaterial color="white" />
          </Box>
        </group>
      );
    case 'shrine':
      return (
        <group>
          <Box args={[1.5, 0.5, 1.5]} position={[0, 0.25, 0]}>
             <meshStandardMaterial color="#d4af37" />
          </Box>
          <Box args={[1, 1.2, 1]} position={[0, 1, 0]}>
             <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[1.8, 0.3, 1.8]} position={[0, 1.7, 0]}>
             <meshStandardMaterial color="#333" />
          </Box>
        </group>
      );
    case 'lantern':
      return (
        <group>
            <Cylinder args={[0.3, 0.3, 0.8, 8]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#ff4d4d" emissive="#ff4d4d" emissiveIntensity={0.5} />
            </Cylinder>
            <Box args={[0.35, 0.1, 0.35]} position={[0, 0.85, 0]}>
                <meshStandardMaterial color="#333" />
            </Box>
            <Box args={[0.35, 0.1, 0.35]} position={[0, -0.05, 0]}>
                <meshStandardMaterial color="#333" />
            </Box>
        </group>
      );
    case 'bamboo':
        return (
            <group>
                <Cylinder args={[0.1, 0.1, 2, 6]} position={[0, 1, 0]}>
                    <meshStandardMaterial color="#2d5a27" />
                </Cylinder>
                <Box args={[0.3, 0.1, 0.3]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color="#4a7a3b" />
                </Box>
                <Box args={[0.3, 0.1, 0.3]} position={[0, 1.5, 0]}>
                    <meshStandardMaterial color="#4a7a3b" />
                </Box>
            </group>
        );
    case 'pine_tree':
        return (
            <group>
                <Box args={[0.3, 1, 0.3]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color="#5d4037" />
                </Box>
                <Cone args={[1.2, 1.5, 4]} position={[0, 1.5, 0]}>
                    <meshStandardMaterial color="#1a331a" />
                </Cone>
                <Cone args={[0.8, 1, 4]} position={[0, 2.2, 0]}>
                    <meshStandardMaterial color="#2a4a2a" />
                </Cone>
            </group>
        );
    case 'rock':
        return (
            <Box args={[0.8, 0.6, 0.8]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#555555" />
            </Box>
        );
    case 'fence':
        return (
            <group>
                <Box args={[0.1, 0.8, 0.1]} position={[-0.4, 0.4, 0]}>
                    <meshStandardMaterial color="#8b4513" />
                </Box>
                <Box args={[0.1, 0.8, 0.1]} position={[0.4, 0.4, 0]}>
                    <meshStandardMaterial color="#8b4513" />
                </Box>
                <Box args={[1, 0.1, 0.1]} position={[0, 0.6, 0]}>
                    <meshStandardMaterial color="#8b4513" />
                </Box>
                <Box args={[1, 0.1, 0.1]} position={[0, 0.2, 0]}>
                    <meshStandardMaterial color="#8b4513" />
                </Box>
            </group>
        );
    case 'elephant':
        return (
            <group>
                <Box args={[1.2, 0.8, 0.8]} position={[0, 0.4, 0]}>
                    <meshStandardMaterial color="#888888" />
                </Box>
                <Box args={[0.6, 0.6, 0.6]} position={[0.7, 0.7, 0]}>
                    <meshStandardMaterial color="#888888" />
                </Box>
                <Box args={[0.2, 0.6, 0.2]} position={[1, 0.4, 0]}>
                    <meshStandardMaterial color="#888888" />
                </Box>
            </group>
        );
    case 'bridge':
      return (
        <group>
          <Box args={[2, 0.2, 1]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[0.1, 0.6, 1]} position={[-0.95, 0.3, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
          <Box args={[0.1, 0.6, 1]} position={[0.95, 0.3, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
        </group>
      );
    case 'grass':
      return (
        <group>
          <Box args={[1, 0.1, 1]} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#90be6d" />
          </Box>
          <Box args={[0.1, 0.3, 0.1]} position={[0.2, 0.2, 0.2]}>
            <meshStandardMaterial color="#4d908e" />
          </Box>
          <Box args={[0.1, 0.2, 0.1]} position={[-0.2, 0.15, -0.1]}>
            <meshStandardMaterial color="#4d908e" />
          </Box>
        </group>
      );
    case 'gravel_path':
      return (
        <Box args={[1, 0.05, 1]} position={[0, 0.025, 0]}>
          <meshStandardMaterial color="#ced4da" />
        </Box>
      );
    case 'dog':
      return (
        <group>
          <Box args={[0.6, 0.4, 0.4]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#e6ccb2" />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0.35, 0.35, 0]}>
            <meshStandardMaterial color="#e6ccb2" />
          </Box>
          <Box args={[0.1, 0.2, 0.1]} position={[0.45, 0.45, 0.1]}>
            <meshStandardMaterial color="#7f5539" />
          </Box>
          <Box args={[0.1, 0.2, 0.1]} position={[0.45, 0.45, -0.1]}>
            <meshStandardMaterial color="#7f5539" />
          </Box>
        </group>
      );
    case 'cat':
      return (
        <group>
          <Box args={[0.5, 0.35, 0.35]} position={[0, 0.175, 0]}>
            <meshStandardMaterial color="#adb5bd" />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0.3, 0.35, 0]}>
            <meshStandardMaterial color="#adb5bd" />
          </Box>
          <Cone args={[0.1, 0.15, 3]} position={[0.35, 0.55, 0.1]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#adb5bd" />
          </Cone>
          <Cone args={[0.1, 0.15, 3]} position={[0.35, 0.55, -0.1]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#adb5bd" />
          </Cone>
        </group>
      );
    case 'grandpa':
    case 'grandma':
    case 'man':
    case 'woman':
    case 'boy':
    case 'girl':
      const isKid = type === 'boy' || type === 'girl';
      const isOld = type === 'grandpa' || type === 'grandma';
      const isFemale = type.includes('woman') || type === 'girl' || type === 'grandma';
      const bodyColor = isFemale ? '#ff8fa3' : '#4cc9f0';
      const headColor = isOld ? '#e9ecef' : '#fbc4ab';
      const height = isKid ? 0.8 : 1.2;
      return (
        <group>
          {/* Leg Left */}
          <Box args={[0.15, height * 0.4, 0.15]} position={[-0.1, height * 0.2, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
          {/* Leg Right */}
          <Box args={[0.15, height * 0.4, 0.15]} position={[0.1, height * 0.2, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
          {/* Body */}
          <Box args={[0.4, height * 0.4, 0.25]} position={[0, height * 0.6, 0]}>
            <meshStandardMaterial color={bodyColor} />
          </Box>
          {/* Head */}
          <Box args={[0.3, 0.3, 0.3]} position={[0, height * 0.95, 0]}>
            <meshStandardMaterial color={headColor} />
          </Box>
          {/* Hair/Cap/Accessories */}
          {description_person_extras(type, height)}
        </group>
      );
    case 'cloud':
      return (
        <group>
          <Box args={[1.5, 0.6, 0.8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="white" transparent opacity={0.9} />
          </Box>
          <Box args={[0.8, 0.5, 0.6]} position={[0.5, 0.3, 0.2]}>
            <meshStandardMaterial color="white" transparent opacity={0.9} />
          </Box>
          <Box args={[0.8, 0.5, 0.6]} position={[-0.5, 0.2, -0.2]}>
            <meshStandardMaterial color="white" transparent opacity={0.9} />
          </Box>
        </group>
      );
    case 'lake':
      return (
        <group>
          <Box args={[2, 0.05, 2]} position={[0, 0.025, 0]}>
            <meshStandardMaterial color="#48cae4" transparent opacity={0.7} />
          </Box>
          <Box args={[0.4, 0.1, 0.4]} position={[0.5, 0, 0.5]}>
            <meshStandardMaterial color="#555" />
          </Box>
        </group>
      );
    case 'taipei101':
      return (
        <group>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} args={[1.2 - i * 0.15, 0.8, 1.2 - i * 0.15]} position={[0, 0.4 + i * 0.8, 0]}>
              <meshStandardMaterial color="#008b8b" />
            </Box>
          ))}
          <Cylinder args={[0.05, 0.05, 1.5, 6]} position={[0, 6, 0]}>
            <meshStandardMaterial color="#008b8b" />
          </Cylinder>
        </group>
      );
    case 'office_building':
      return (
        <group>
          <Box args={[1, 3, 1]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#404040" />
          </Box>
          {[0.5, 1, 1.5, 2, 2.5].map((y) => (
            <group key={y}>
              <Box args={[1.05, 0.2, 0.8]} position={[0, y, 0]}>
                <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.2} />
              </Box>
            </group>
          ))}
        </group>
      );
    case 'house':
      return (
        <group>
          <Box args={[1, 0.8, 1]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#f4a460" />
          </Box>
          <Cone args={[1, 0.6, 4]} rotation={[0, Math.PI / 4, 0]} position={[0, 1.1, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cone>
        </group>
      );
    case 'convenience_store':
      return (
        <group>
          <Box args={[1.5, 1, 1.2]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="white" />
          </Box>
          <Box args={[1.55, 0.2, 0.1]} position={[0, 0.8, 0.6]}>
            <meshStandardMaterial color="#cc0000" />
          </Box>
          <Box args={[1.6, 0.1, 1.3]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#ddd" />
          </Box>
        </group>
      );
    case 'road':
      return (
        <group>
          <Box args={[1, 0.05, 1]} position={[0, 0.025, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
          <Box args={[0.1, 0.06, 0.4]} position={[0, 0.025, 0]}>
            <meshStandardMaterial color="white" />
          </Box>
        </group>
      );
    case 'traffic_light':
      return (
        <group>
          <Box args={[0.1, 2, 0.1]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#222" />
          </Box>
          <Box args={[0.3, 0.8, 0.3]} position={[0, 1.8, 0]}>
            <meshStandardMaterial color="#222" />
          </Box>
          <Sphere args={[0.1]} position={[0, 2.1, 0.15]}>
            <meshStandardMaterial color="red" />
          </Sphere>
          <Sphere args={[0.1]} position={[0, 1.8, 0.15]}>
            <meshStandardMaterial color="yellow" />
          </Sphere>
          <Sphere args={[0.1]} position={[0, 1.5, 0.15]}>
            <meshStandardMaterial color="green" />
          </Sphere>
        </group>
      );
    case 'street_light':
      return (
        <group>
          <Box args={[0.1, 2.5, 0.1]} position={[0, 1.25, 0]}>
            <meshStandardMaterial color="#222" />
          </Box>
          <Box args={[0.4, 0.1, 0.1]} position={[0.2, 2.4, 0]}>
            <meshStandardMaterial color="#222" />
          </Box>
          <Box args={[0.3, 0.3, 0.3]} position={[0.4, 2.25, 0]}>
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
          </Box>
        </group>
      );
    case 'car':
      return (
        <group>
          <Box args={[1.2, 0.4, 0.6]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#ff0000" />
          </Box>
          <Box args={[0.6, 0.3, 0.5]} position={[-0.1, 0.55, 0]}>
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
          </Box>
          {[-0.4, 0.4].map(x => [-0.25, 0.25].map(z => (
            <Cylinder key={`${x}-${z}`} args={[0.15, 0.15, 0.1]} position={[x, 0.15, z]} rotation={[Math.PI/2, 0, 0]}>
               <meshStandardMaterial color="black" />
            </Cylinder>
          )))}
        </group>
      );
    case 'motorcycle':
       return (
        <group>
          <Box args={[0.7, 0.5, 0.2]} position={[0, 0.35, 0]}>
            <meshStandardMaterial color="#ffcc00" />
          </Box>
          <Box args={[0.2, 0.4, 0.05]} position={[0.3, 0.6, 0]}>
            <meshStandardMaterial color="#333" />
          </Box>
          <Cylinder args={[0.2, 0.2, 0.1, 12]} position={[-0.25, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="black" />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.1, 12]} position={[0.25, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="black" />
          </Cylinder>
        </group>
       );
    case 'apartment':
      return (
        <group>
          <Box args={[1.5, 2.5, 1.2]} position={[0, 1.25, 0]}>
            <meshStandardMaterial color="#a5a5a5" />
          </Box>
          {[0.5, 1.2, 1.9].map((y) => (
            <group key={y}>
              <Box args={[0.4, 0.4, 0.1]} position={[-0.4, y, 0.6]}>
                <meshStandardMaterial color="#87ceeb" />
              </Box>
              <Box args={[0.4, 0.4, 0.1]} position={[0.4, y, 0.6]}>
                <meshStandardMaterial color="#87ceeb" />
              </Box>
              {/* Balconies */}
              <Box args={[1.6, 0.1, 0.3]} position={[0, y - 0.25, 0.75]}>
                <meshStandardMaterial color="#555" />
              </Box>
            </group>
          ))}
        </group>
      );
    case 'large_park':
      return (
        <group>
          <Box args={[4, 0.1, 4]} position={[0, 0.05, 0]}>
            <meshStandardMaterial color="#7cb342" />
          </Box>
          {/* Some trees in the park */}
          <group position={[-1, 0.1, -1]}>
             <Box args={[0.2, 0.8, 0.2]} position={[0, 0.4, 0]}><meshStandardMaterial color="#5d4037" /></Box>
             <Box args={[0.6, 0.6, 0.6]} position={[0, 1, 0]}><meshStandardMaterial color="#2d5a27" /></Box>
          </group>
          <group position={[1, 0.1, 1]}>
             <Box args={[0.2, 0.8, 0.2]} position={[0, 0.4, 0]}><meshStandardMaterial color="#5d4037" /></Box>
             <Box args={[0.6, 0.6, 0.6]} position={[0, 1, 0]}><meshStandardMaterial color="#2d5a27" /></Box>
          </group>
          {/* Bench */}
          <group position={[0, 0.1, 0]}>
             <Box args={[0.8, 0.1, 0.3]} position={[0, 0.2, 0]}><meshStandardMaterial color="#8b4513" /></Box>
             <Box args={[0.1, 0.3, 0.1]} position={[-0.35, 0.15, 0]}><meshStandardMaterial color="#333" /></Box>
             <Box args={[0.1, 0.3, 0.1]} position={[0.35, 0.15, 0]}><meshStandardMaterial color="#333" /></Box>
          </group>
        </group>
      );
    default:
      return (
        <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color={color} />
        </Box>
      );
  }
};
