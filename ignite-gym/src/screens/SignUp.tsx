import { VStack, Image, Center, Text, Heading, ScrollView } from 'native-base'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Platform } from 'react-native';

import { useForm, Controller } from 'react-hook-form'

import { useNavigation} from "@react-navigation/native"


import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string
}

const SignUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o e-mail.').email('E-mail invalido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 digitos.'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null], 'A confirmação da senha não confere.')
});

export function SignUp() {
 const navigation = useNavigation()

 const { control, handleSubmit, formState: { errors }} = useForm<FormDataProps>({
    resolver: yupResolver(SignUpSchema)
 })

 function handleGoBack() {
    navigation.goBack()
 }


 function handleSignUp(data: FormDataProps) {
  console.log(data)
 }


    return (
        <ScrollView  showsVerticalScrollIndicator={false}>

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
                    Crie sua conta
                </Heading>

                <Controller
                 control={control}
                 name='name'
                 render={({ field: { onChange, value }}) => (
                    <Input 
                     placeholder='Nome'
                     onChangeText={onChange}
                     value={value}
                     errorMessage={errors.name?.message}
                    />
                 )}
                />


                <Controller
                 control={control}
                 name='email'
                 render={({ field: { onChange, value }}) => (
                    <Input 
                    placeholder='E-mail'
                    onChangeText={onChange}
                    value={value}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    errorMessage={errors.email?.message}
                   />
                 )}      
                />


                <Controller
                 control={control}
                 name='password'
                 render={({ field: { onChange, value }}) => (
                    <Input 
                     placeholder='Senha'
                     onChangeText={onChange}
                     value={value}
                     secureTextEntry
                     errorMessage={errors.password?.message}
                />
                 )}
                />      

                <Controller
                 control={control}
                 name='password_confirm'
                 render={({ field: { onChange, value }}) => (
                    <Input 
                    placeholder='Confirme a Senha'
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    onSubmitEditing={handleSubmit(handleSignUp)}
                    returnKeyType='send'
                    errorMessage={errors.password_confirm?.message}
                   />
                 )}
                /> 

                <Button 
                 title='Criar e acessar'
                 onPress={handleSubmit(handleSignUp)}
                />

            </Center>

                <Button 
                 title='Voltar para o login'
                 variant='outline'
                 mt={12}
                 onPress={handleGoBack}
                />
    
         </VStack>
        </ScrollView>
    );
}