import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';

import Head from 'next/head';

const LayoutComp = (props) => {
    return (
        <Container>
             <Head>
                <link
                    async
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
                {/* <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script> */}

            </Head>

            <Header />
            {props.children}
            <h2>I'm a Footer Section</h2>
        </Container>
    );
};
export default LayoutComp;