import styled from 'styled-components';
import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <Wrapper>
            <Navbar/>
            <section>
                <Outlet/>
            </section>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    section {
        height: calc(100vh - 4rem);
    }
`;

export default HomeLayout;