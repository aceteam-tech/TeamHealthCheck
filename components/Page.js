import React from 'react';
import styled from 'styled-components/native'
import BgBlueGradient from '../assets/images/bg-blue-gradient-2x.png'

const Page = styled.ImageBackground`
    flex: 1;
    padding-top: 30px;
`

export default ({children}) => (
    <Page source={BgBlueGradient}>
        {children}
    </Page>
)