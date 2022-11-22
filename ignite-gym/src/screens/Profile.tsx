import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {ScrollView, VStack, Center, Skeleton, Text, Heading} from 'native-base';

import * as ImagePicker from 'expo-image-picker'

import { UserPhoto } from '@components/UserPhoto';
import { ScreenHeader } from '@components/ScreenHeader';
import { Input } from '@components/Input';
import { Button} from  '@components/Button'




export function Profile() {
    const [ photoIsLoading, setPhotoIsLoading ] = useState(false) // skeleton

    const [userPhoto, setUserPhoto] = useState('https://github.com/licask8.png');

    const PHOTO_SIZE = 33

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true);

        try {
            const photoSelected =  await ImagePicker.launchImageLibraryAsync({ // definindo propriedades da imagem
                mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
                
            });

            if( photoSelected.canceled) {
                return;
            }

            if(photoSelected.assets[0].uri) {
                setUserPhoto(photoSelected.assets[0].uri);
            }
    
           
        } catch (error) {
            
        } finally {
            setPhotoIsLoading(false)
        }

     

    }

    return (
        <VStack flex={1}>

            <ScreenHeader title='Perfil' />

            <ScrollView contentContainerStyle={{paddingBottom: 36 }}>

                <Center mt={6} px={10}>
                {  
                photoIsLoading ?
                <Skeleton
                     w={PHOTO_SIZE}
                     h={PHOTO_SIZE}
                     rounded='full'
                     startColor='gray.500'
                     endColor='gray.400'
                    />
                    :
                    <UserPhoto 
                     source={{ uri: userPhoto }}
                     alt='Foto do usuário'
                     size={PHOTO_SIZE}
                    />
                }

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8} >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Input 
                     placeholder='Nome'
                     bg='gray.600'
                    />

                    <Input 
                     bg='gray.600'
                     placeholder='elielson.50@hotmmail.com'
                     isDisabled
                    />

                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontSize='md' mb={2} alignSelf='flex-start' mt={12} >
                        Alterar senha
                    </Heading>

                    <Input 
                     placeholder='Senha antiga'
                     secureTextEntry
                     bg='gray.600'
                    />

                    <Input 
                     placeholder='Nova senha'
                     secureTextEntry
                     bg='gray.600'
                    />

                    <Input 
                     placeholder='Confirme a nova senha'
                     secureTextEntry
                     bg='gray.600'
                    />

                    <Button
                     title='Atualizar' 
                     mt={4}
                    />

                </VStack>

            </ScrollView>

        </VStack>
    );
}