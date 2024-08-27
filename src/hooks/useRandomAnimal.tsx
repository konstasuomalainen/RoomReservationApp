// hooks/useRandomAnimal.ts
import { useState, useEffect } from 'react';

const commonAnimals: string[] = [
  "Dog", "Cat", "Horse", "Sheep", "Goat", "Chicken", "Duck", "Turkey",
  "Rabbit", "Hamster", "Guinea Pig", "Parrot", "Canary", "Goldfish", "Salmon", "Trout",
  "Eagle", "Hawk", "Pigeon", "Crow", "Sparrow", "Peacock", "Swan", "Frog", "Toad",
  "Turtle", "Lizard", "Snake", "Elephant", "Lion", "Tiger", "Bear", "Deer", "Wolf",
  "Fox", "Giraffe", "Kangaroo"
];

const useRandomAnimal = (reservedAnimals: string[]) => {
  const [animal, setAnimal] = useState('');

  const getRandomAnimal = () => {
    // Filter out reserved animals from the list of common animals
    const availableAnimals = commonAnimals.filter(animal => !reservedAnimals.includes(animal));
    
    // If there are no available animals, return an empty string or handle the situation appropriately
    if (availableAnimals.length === 0) {
      return '';
    }
    const randomIndex = Math.floor(Math.random() * availableAnimals.length);
    return availableAnimals[randomIndex];
  };

  useEffect(() => {
    // Only set a new animal if the current one is reserved or initially empty
    if (!animal || reservedAnimals.includes(animal)) {
      const newAnimal = getRandomAnimal();
      setAnimal(newAnimal);
    }
    // We intentionally avoid adding `animal` to the dependencies array
  }, [reservedAnimals]);


  const setNewRandomAnimal = () => {
    const newAnimal = getRandomAnimal();
    setAnimal(newAnimal);
  };

  return { animal, setNewRandomAnimal };
};

export default useRandomAnimal;