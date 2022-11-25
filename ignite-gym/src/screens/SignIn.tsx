import { useNavigation} from "@react-navigation/native"
import { VStack, Image, Center, Text, Heading, ScrollView } from 'native-base'
import { Platform } from 'react-native';

import { useForm, Controller} from 'react-hook-form';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import {AuthNavigatorRoutesProps} from '@routes/auth.routes'


type FormDataProps = {
    email: string;
    password: string;
}

 const SignInSchema = yup.object({
    email: yup.string().required('Informe o email.').email('E-mail invalido.'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 digitos.')
 })

export function SignIn() {
 const navigation = useNavigation<AuthNavigatorRoutesProps>()

 const { control, handleSubmit, formState: { errors }} = useForm<FormDataProps>({
    resolver: yupResolver(SignInSchema)
 })

    function handleNewAccount() {
        navigation.navigate('signUp')
    }

    function handleSignIn(data: FormDataProps) {
        console.log(data)
    }

    return (
       // <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>

         <VStack flex={1} bg="gray.700" px={10} pb={Platform.OS === 'ios' ? 40 : 16} >
            <Image 
             source={BackgroundImg}
             defaultSource={BackgroundImg}
             alt="Pessoas treinando"
             resizeMode='contain'
             position='absolute'
            />

            <Center my={24}>
                <LogoSvg />
                
                <Text color='gray.100' fontSize='sm'>
                    Treine sua mente e o seu corpo
                </Text>

            </Center>

            <Center>
                <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
                    Acesse sua conta
                </Heading>

                <Controller 
                 control={control}
                 name="email"
                 render={({ field: {onChange, value}}) => (
                    <Input 
                        placeholder='E-mail'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onChangeText={onChange}
                        value={value}
                        errorMessage={ errors.email?.message}
                    />

                 )}
                />

                <Controller 
                 control={control}
                 name="password"
                 render={({ field: { onChange, value }}) => (
                    <Input 
                     placeholder='password'
                     secureTextEntry
                     onChangeText={onChange}
                     value={value}
                     errorMessage={errors.password?.message }
                    />
                 )}
                />    

                <Button 
                 title='Acessar'
                 onPress={handleSubmit(handleSignIn)}
                />

            </Center>

            <Center mt={24}>
                <Text color='gray.100' fontSize='sm' mb={3} fontFamily='body'>
                    Ainda não tenho acesso?
                </Text>

                <Button 
                 title='Criar conta'
                 variant='outline'
                 onPress={handleNewAccount}
                />
            </Center>

         </VStack>
     //   </ScrollView>
    );
}