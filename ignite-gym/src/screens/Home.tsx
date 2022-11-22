import { useState } from 'react';
import { FlatList, VStack, HStack, Heading, Text } from 'native-base';
import { useNavigation} from "@react-navigation/native"

import { AppRoutesBottomTabNavigateProps} from '@routes/app.routes'


import { HomeHeader} from '@components/HomeHeader'
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';


export function Home() {
 const [ groupSelected, setGroupSelected] = useState('costas');

 const [ group, setGroup] = useState(['Costas', 'Bíceps', 'Tríceps', 'ombro']);

 const [ exercises, setExercises] = useState(['Puxada frontal ', 'Remada unilateral', 'Remada curvada', 'Levantamento terra ', 'ombro']);

 const navigation = useNavigation<AppRoutesBottomTabNavigateProps>() // tipagem das rotas


    function handleOpenExercisesDetail() {
        navigation.navigate('exercise')
    }

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

                <VStack flex={1} px={8}>

                    <HStack  justifyContent='space-between' mb={5}>
                        <Heading color='gray.200' fontSize='md'>
                            Exercícios
                        </Heading>

                        <Text color='gray.200' fontSize='md'>
                            {exercises.length}
                        </Text>
                    </HStack>

                  <FlatList
                   data={exercises}
                   keyExtractor={ item => item}
                   renderItem={({ item }) => (
                    <ExerciseCard
                     onPress={ handleOpenExercisesDetail }
                    />
                   )}
                   showsVerticalScrollIndicator={false}
                   _contentContainerStyle={{ paddingBottom: 20}}
                  />
                  

                </VStack>
        </VStack>
    );
}