import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect} from "@react-navigation/native";
import { FlatList, VStack, HStack, Heading, Text, useToast} from 'native-base';

import { AppRoutesBottomTabNavigateProps} from '@routes/app.routes';

import { ExerciseDTO } from '@dtos/ExerciseDTO'

import {api} from '@services/api'
import { AppError } from '@utils/AppError';

import { Group } from '@components/Group';
import { Loading } from '@components/Loading';
import { HomeHeader} from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';


export function Home() {
 const [isLoading, setIsLoading] = useState(true);
 const [ group, setGroup] = useState<string[]>([]);
 const [ groupSelected, setGroupSelected] = useState('antebraço');
 const [ exercises, setExercises] = useState<ExerciseDTO[]>([]);

 const toast = useToast();
 const navigation = useNavigation<AppRoutesBottomTabNavigateProps>(); // tipagem das rotas


    function handleOpenExercisesDetail(exerciseId: string) {
        navigation.navigate('exercise', {exerciseId});
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups')
            setGroup(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
    }}

    async function fetchExercisesByGroup() {
        try {
            setIsLoading(true)

            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.'

            toast.show({
                title,
                placement: 'top',
                bg: 'red.500'
            })
       } finally {
        setIsLoading(false)

       }
    }

    useEffect(() => {
        fetchGroups()
    },[]);

    useFocusEffect(useCallback(() => {
        fetchExercisesByGroup();
    }, [groupSelected]));

    return (
        
        <VStack flex={1}>
            <HomeHeader />
                <FlatList 
                 data={group}
                 keyExtractor={ item => item}
                 renderItem={({ item }) => (
                    <Group 
                        name={item}
                        isActive={String(groupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase() }
                        onPress={() => setGroupSelected(item)}   
                      />  
                 )}
                 horizontal
                 showsHorizontalScrollIndicator={false}
                 _contentContainerStyle={{ px: 8}}
                 my={10}
                 maxH={10}
                 minHeight={10}
                />

                {isLoading ? <Loading /> : 
                    <VStack flex={1} px={8}>
                        <HStack  justifyContent='space-between' mb={5}>
                            <Heading color='gray.200' fontSize='md' fontFamily='heading'>
                                Exercícios
                            </Heading>
                                <Text color='gray.200' fontSize='md'>
                                       {exercises.length}
                                </Text>
                        </HStack>
                            <FlatList
                              data={exercises}
                              keyExtractor={ item => item.id}
                              renderItem={({ item }) => (
                               <ExerciseCard
                                data={item}
                                onPress={() => handleOpenExercisesDetail(item.id)}
                               />
                              )}
                              showsVerticalScrollIndicator={false}
                              _contentContainerStyle={{ paddingBottom: 20}}
                             />                  
                    </VStack>
                }
        </VStack>
    );
}