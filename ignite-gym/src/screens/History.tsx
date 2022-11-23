import { useState } from 'react';
import { Heading, VStack, SectionList, Text } from 'native-base';


import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';



export function History() {
    const [exercises, setExercises] = useState([
        {
            title: "26.08.22",
            data: ["Puxada frontal", "Remada unilateral"]
        },

        {
            title: "27.08.22",
            data: ["Puxada frontal"]
        },
    ]);

    return (

        <VStack flex={1}>

             <ScreenHeader title='Histórico de exercicíos' />   

             <SectionList 
              sections={exercises}
              keyExtractor={item => item }
              renderItem={({ item }) => (
                <HistoryCard />
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