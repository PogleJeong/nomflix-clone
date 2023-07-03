import { Link, useMatch, PathMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Navigation = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 100;
  width: 100%;
  top: 0;
  background-color: black;
  font-size: 14px;
  font-weight: bold;
  padding: 20px 60px;
  color: white;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  top: -5px;
  right: -5px;
  margin: 0 auto;
  background-color: ${(props)=>props.theme.red};
`

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  position: absolute;
  transform-origin: right center;
  height: 30px;
  padding-left: 10px;
  border-radius: 3px;
  left: -150px;
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    }
  }
}

const navVariants = {
  top: {
    backgroundColor: "rgba(0,0,0,0)", //투명함
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,1)",
  }
}

interface IForm {
  keyword: string;
}

function Header() {
  const [ searchOpen, setSearchOpen ] = useState(false);
  const homeMatch: PathMatch<string> | null = useMatch("/");
  const tvMatch: PathMatch<string> | null = useMatch("/tv");
  const inputAnimation = useAnimation(); // 애니메이션을 동시에 실행시키고 싶은경우
  const navAnimation = useAnimation();
  const { scrollY } = useScroll(); // 스크롤감지 애니메이션
  const { register, handleSubmit } = useForm<IForm>(); // useForm (typescript)
  const navigate = useNavigate(); // 검색후 router 이동

  // 컴포넌트 내 함수를 이용한 useAnimation
  const toggleSearch = () => {
    if(searchOpen) {
       inputAnimation.start({
        scaleX: 0
      })
    }else{
      inputAnimation.start({
        scaleX: 1
      })
    }
    setSearchOpen((prev)=>!prev);
  }
  const onValid = (data:IForm) => {
    navigate(`/search?keyword=${data?.keyword}`);
  }
  useMotionValueEvent(scrollY, "change", (positionY)=>{
    // scroll 위치를 감지하고 해당 위치에 따른 애니메이션 적용(variants 가능)
    if (positionY > 80) {
      navAnimation.start("scroll")
    }else{
      navAnimation.start("top")
      
    }
  })
  return(
    <Navigation 
      variants={navVariants}
      animate={navAnimation} // nav
      initial="top"
      >
      <Column>
        <Logo 
          variants={logoVariants}
          initial="normal"
          whileHover="active"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>      
            <Link to="/">Home {!homeMatch ? null : <Circle layoutId="activeMenu" />}</Link>
          </Item>
          <Item>
            <Link to="tv">Tv Shows {!tvMatch ? null : <Circle layoutId="activeMenu" />}</Link>
          </Item>       
        </Items>
      </Column>
      <Column>
        <Search onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("keyword", {required: true, minLength: 2})}
            animate={inputAnimation}
            initial={{scaleX: 0}}
            transition={{ type: "linear" }}
            placeholder="Search for movie or tv show..."
          />
          <motion.svg
              onClick={toggleSearch}
              whileHover={{cursor: "pointer"}}
              animate={{ x: searchOpen ? -185 : 0 }}
              transition={{ type: "linear" }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
        </Search>
      </Column>
    </Navigation>
  )
};

export default Header;