// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert, ActivityIndicator, Dimensions } from 'react-native';

const SNAKE_LENGTH = 5;
const CELL_SIZE = 20;
const BOARD_SIZE = Dimensions.get('window').width;

const getInitialSnake = (length) => {
    const initialSnake = [];
    for (let i = length - 1; i >= 0; i--) {
        initialSnake.push({ x: i * CELL_SIZE, y: 0 });
    }
    return initialSnake;
};

const generateFood = () => {
    const maxCells = BOARD_SIZE / CELL_SIZE;
    return {
        x: Math.floor(Math.random() * maxCells) * CELL_SIZE,
        y: Math.floor(Math.random() * maxCells) * CELL_SIZE,
    };
};

const SnakeGame = () => {
    const [snake, setSnake] = useState(getInitialSnake(SNAKE_LENGTH));
    const [food, setFood] = useState(generateFood());
    const [direction, setDirection] = useState('RIGHT');
    const [isGameOver, setIsGameOver] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        startGame();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isGameOver) {
            intervalRef.current = setInterval(moveSnake, 100);
        } else {
            clearInterval(intervalRef.current);
        }
    }, [direction, snake, isGameOver]);

    useEffect(() => {
        if (isSnakeColliding()) {
            setIsGameOver(true);
            clearInterval(intervalRef.current);
            Alert.alert('Game Over', 'Better luck next time!', [{ text: 'OK', onPress: resetGame }]);
        }
    }, [snake]);

    const startGame = () => {
        setSnake(getInitialSnake(SNAKE_LENGTH));
        setDirection('RIGHT');
        setIsGameOver(false);
        setFood(generateFood());
    };

    const resetGame = () => {
        startGame();
    };

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case 'UP':
                head.y -= CELL_SIZE;
                break;
            case 'DOWN':
                head.y += CELL_SIZE;
                break;
            case 'LEFT':
                head.x -= CELL_SIZE;
                break;
            case 'RIGHT':
                head.x += CELL_SIZE;
                break;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            setFood(generateFood());
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const isSnakeColliding = () => {
        const head = snake[0];

        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
            return true;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    };

    const changeDirection = (newDirection) => {
        setDirection(newDirection);
    };

    return (
        <View style={styles.board}>
            {snake.map((segment, index) => (
                <View key={index} style={[styles.snake, { left: segment.x, top: segment.y }]} />
            ))}
            <View style={[styles.food, { left: food.x, top: food.y }]} />
            <View style={styles.controls}>
                <Button title="Up" onPress={() => changeDirection('UP')} />
                <View style={styles.horizontalButtons}>
                    <Button title="Left" onPress={() => changeDirection('LEFT')} />
                    <Button title="Right" onPress={() => changeDirection('RIGHT')} />
                </View>
                <Button title="Down" onPress={() => changeDirection('DOWN')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        position: 'relative',
        backgroundColor: '#000',
    },
    snake: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginVertical: 10,
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
    }
});