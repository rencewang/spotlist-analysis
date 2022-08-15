import styled from 'styled-components';

export const Link = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    /* color: ${({ theme }) => theme.hoverColor}; */
    color: gray;
  }
`;

export const Button = styled.button`
  color: inherit;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: auto;
  font-size: inherit;
  border: none;
  background-color: transparent;
  transition: color 0.3s ease;
`;

export const Container = styled.div`
  display: grid;
  position: fixed;
  width: 100%;
  height: 100%;
  grid-template-columns: auto;
  grid-template-rows: 50px auto;
  grid-template-areas:
    'nav'
    'bdy';
  overflow: hidden;

  @media screen and (max-width: 700px) {
    grid-template-rows: 100px auto;
  }
`;

export const Header = styled.header`
  grid-area: nav;
  height: 100%;
  width: 100%;
  padding: 0 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 700px) {
    padding: 0 10px;
    align-items: flex-start;
    justify-content: space-around;
    flex-direction: column !important;
    border-bottom: 2px solid;
  }
`;

export const Content = styled.div`
  grid-area: bdy;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-color: transparent;
`;

export const FullPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  div {
    width: fit-content;
    margin: auto;
    font-weight: bold;
  }
`;

export const Alert = styled.div`
  z-index: 9999;
  display: none;
  opacity: 0;
  width: fit-content;
  position: fixed;
  bottom: 30px;
  left: 30px;
  padding: 10px 30px;
  background-color: white;
  /* background-color: ${({ theme }) => theme.backgroundColor}; */

  border-radius: 10px;
  border: 2px solid;
  font-weight: bold;
  transition: all 1s ease;
`;

export const Flex = styled.div`
  display: flex;
`;

export const Justified = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SelectOptions = {
  control: (provided) => ({
    ...provided,
    width: 350,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 999,
  }),
  menuList: (provided) => ({
    ...provided,
    '::-webkit-scrollbar': {
      width: '0px',
      height: '0px',
    },
  }),
};

export const SelectTheme = (theme) => ({
  ...theme,
  borderRadius: 10,
  colors: {
    ...theme.colors,
    neutral0: 'white',
    primary25: '#C0C0C0',
    primary50: '#C0C0C0',
    primary: `#595959`,
  },
});
