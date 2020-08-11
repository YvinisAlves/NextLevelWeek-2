import React, { useState,  } from 'react';
import { View, Text } from 'react-native';

import {Feather} from '@expo/vector-icons';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState([]);

function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
        if (response){
            const favoritedTeachers = JSON.parse(response);
            const favoritedTeachersIds = favoritedTeachers.map( (teacher: Teacher) => {
                return teacher.id;
            })
            setFavorites(favoritedTeachersIds);
        }
    });
}

useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
)

    function handleToggleFiltersVisible(){
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit(){
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        });
        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title='Proffys disponiveis' 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name='filter' size={20} color='#FFF'/>
                    </BorderlessButton>
                )}
            >
                { isFiltersVisible && (
                <View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput 
                        placeholderTextColor='#c1bccc'
                        value={subject}
                        onChangeText={text => setSubject(text)}
                        style={styles.input}
                        placeholder='Qual a matéria?'
                    />
                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput 
                                placeholderTextColor='#c1bccc'
                                value={week_day}
                                onChangeText={text => setWeekDay(text)}
                                style={styles.input}
                                placeholder='Qual o dia?'
                            />
                        </View>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput 
                                placeholderTextColor='#c1bccc'
                                value={time}
                                onChangeText={text => setTime(text)}
                                style={styles.input}
                                placeholder='Qual horário?'
                            />
                        </View>
                    </View>
                    <RectButton 
                        style={styles.submitButton}
                        onPress={handleFiltersSubmit}
                    >
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />)
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;