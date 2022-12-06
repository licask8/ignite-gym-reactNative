import { useState, useEffect, useCallback } from 'react';
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';

import { AppError } from '@utils/AppError';

import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { api } from '@services/api';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryByDayDTO } from '@dtos/HistoryGroupByDayDTO';



export function History() {
    const [ isLoading, setIsLoading] = useState(true)
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    const toast = useToast();

    async function fecthHistory() {
        try {
            setIsLoading(true)

            const response = await api.get('/history');
            setExercises(response.data)
            
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

            toast.show({
             title,
             placement: 'top',
             bg: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fecthHistory()
    }, []));

    return (

        <VStack flex={1}>

             <ScreenHeader title='Histórico de exercicíos' />   

             <SectionList 
              sections={exercises}
              keyExtractor={item => item.id }
              renderItem={({ item }) => (
                <HistoryCard data={item} />
              )}
              renderSectionHeader={({ section }) => (
                <Heading color='gray.200' fontSize='md' fontFamily='heading' mt={10} mb={3}>
                    {section.title}
                </Heading>
              )}
              px={8}
              contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: 'center'}}
              ListEmptyComponent={() => (
                <Text color='gray.100' textAlign='center'>
                    Não há exercicíos registrados ainda. {'\n'} 
                    Vamos fezer exercicíos hoje?
                </Text>
              )}
             />

             
          
        </VStack>
    );
}