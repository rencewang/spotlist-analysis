import styled from "styled-components"

export const Link = styled.a`
    color: inherit;
    text-decoration: none;
    &: hover { 
        color: #000; 
    }
    transition: color 0.3s ease; 
`

export const Button = styled.button`
    color: inherit;
    cursor: pointer;
    margin-top: auto;
    margin-bottom: auto;
    font-size: inherit;
    border: none;
    background-color: transparent;
    &: hover { 
        color: #000; 
    }
    transition: color 0.3s ease; 
`

export const Container = styled.div`
    display: grid;
    position: fixed;
    width: 100%;
    height: 100%;
    grid-template-columns: auto;
    grid-template-rows: 50px auto;
    grid-template-areas: 
        "nav"
        "bdy";
    overflow: hidden;
`

export const Header = styled.header`
    grid-area: nav;
    height: 100%;
    width: 100%;
    padding: 0 30px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 30%);
`

export const Content = styled.div`
    grid-area: bdy;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-color: transparent;
`

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
`

export const Alert = styled.div`
    z-index: 9999;
    display: none;
    opacity: 0;
    width: fit-content;
    position: fixed;
    bottom: 30px;
    left: 30px;
    padding: 10px 30px;
    background-color: rgba(255, 255, 255, 100%);
    border-radius: 10px;
    border: 2px solid black;
    font-weight: bold;
    transition: all 1s ease; 
`

export const Flex = styled.div`
    display: flex;
`

export const Justified = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const SelectOptions = {
    control: (provided) => ({
        ...provided,
        width: 300,
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 999,
    }),
    menuList: (provided) => ({
        ...provided,
        "::-webkit-scrollbar": {
          width: "0px",
          height: "0px",
        }
    })
}

export const SelectTheme = (theme) => ({
    ...theme,
    borderRadius: 10,
    colors: {
      ...theme.colors,
      neutral0: 'white',
      primary25: '#C0C0C0',
      primary50: '#C0C0C0',
      primary: 'black',
    },
})