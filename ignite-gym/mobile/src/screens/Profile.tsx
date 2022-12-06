import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { TouchableOpacity } from 'react-native';
import {ScrollView, VStack, Center, Skeleton, Text, Heading, useToast} from 'native-base';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';


import { useForm, Controller } from 'react-hook-form';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as ImagePicker from 'expo-image-picker'

import { Input } from '@components/Input';
import { Button} from  '@components/Button';
import { UserPhoto } from '@components/UserPhoto';
import { ScreenHeader } from '@components/ScreenHeader';

type FormdataUpdateProps = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirm_password: string
}

 const profileSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
    // old_password: yup.string().required('Informe a senha antiga.'),
    confirm_password: yup
     .string()
     .nullable()
     .transform((value) => !!value ? value : null)
     .oneOf([yup.ref('password'), null], 'A confirmação não confere.')
     .when('password', { 
        is: (Field: any) => Field,
        then: yup.string().nullable().required('Informe a confirmação da senha.') 
     })
 })


export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [ photoIsLoading, setPhotoIsLoading ] = useState(false) // skeleton

    const toast = useToast();

    const { user, updateUserProfile } = useAuth();

    const {control, handleSubmit, formState: { errors }} = useForm<FormdataUpdateProps>({
        defaultValues: {
            name: user.name,
            email: user.email
        },
        resolver: yupResolver(profileSchema),
       
    })

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
                
            }   
                const photoUri = photoSelected.assets[0].uri
                const fileExtension = photoUri.split('.').pop();
                
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
                    uri: photoUri,
                    type: 'image/jpeg'
                } as any

                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;
                updateUserProfile(userUpdated);
                

                toast.show({
                    title: 'Foto atualizada',
                    placement: 'top',
                    bg: 'green.500'
                })

            } catch (error) {
                
            } finally {
                setPhotoIsLoading(false)
            }
        }

      async  function handleProfileUpdate(data: FormdataUpdateProps) {
            try {
                setIsUpdating(true);

                const userUpdated= user;
                userUpdated.name = data.name;

                await api.put('/users', data);
              
                await updateUserProfile(userUpdated);

                toast.show({
                    title: 'Perfil atualizado com sucesso!',
                    placement:'top',
                    bg: 'green.700'
                });

            } catch (error) {
                const isAppError = error instanceof AppError;
                const title = isAppError ? error.message : "Não foi possível atualizar seus dados. Tente mais tarde."

                toast.show({
                    title,
                    placement: 'top',
                    bg: 'red.500'
                })
            } finally {
                setIsUpdating(false);
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
                    source={ 
                        user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                        : defaultUserPhotoImg 
                       }
                     alt='Foto do usuário'
                     size={PHOTO_SIZE}
                    />
                }

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color='green.500' fontWeight='bold' fontSize='md' mt={2} mb={8} >
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Controller 
                     control={control}
                     name='name'
                     render={({field: {onChange, value }}) => (
                        <Input 
                         placeholder='Nome'
                         bg='gray.600'
                         value={value}
                         onChangeText={onChange}
                         errorMessage={errors.name?.message}
                    />
                     )}
                    />

                    <Controller 
                     control={control}
                     name="email"
                     render={({field: {value, onChange}}) => (
                        <Input 
                         bg='gray.600'
                         placeholder='E-mail'
                         isDisabled
                         value={value}
                         onChangeText={onChange}
                    />
                     )}
                    />

                    

                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading color='gray.200' fontFamily='heading' fontSize='md' mb={2} alignSelf='flex-start' mt={12} >
                        Alterar senha
                    </Heading>

                    <Controller 
                     control={control}
                     name="old_password"
                     render={({ field: {onChange }}) => (
                        <Input 
                         placeholder='Senha antiga'
                         secureTextEntry
                         bg='gray.600'
                         onChangeText={onChange}
                        
                        />
                     )}
                    />

                   <Controller 
                     control={control}
                     name="password"
                     render={({ field: { onChange }}) => (
                        <Input 
                         placeholder='Nova senha'
                         secureTextEntry
                         bg='gray.600'
                         onChangeText={onChange}
                         errorMessage={errors.password?.message}
                         />
                     )}
                    />

                    <Controller 
                     control={control}
                     name="confirm_password"
                     render={({ field: { onChange }}) => (
                        <Input 
                         placeholder='Confirme a nova senha'
                         secureTextEntry
                         bg='gray.600'
                         onChangeText={onChange}
                         errorMessage={errors.confirm_password?.message}
                        />
                     )}
                    />

                    <Button
                     title='Atualizar' 
                     mt={4}
                     onPress={handleSubmit(handleProfileUpdate)}
                     isLoading={isUpdating}
                    />

                </VStack>

            </ScrollView>


        </VStack>
    );
}