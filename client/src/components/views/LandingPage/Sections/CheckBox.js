import React, {useState} from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([])
    
    const handleToggle = (value) => {
        
        // 누른 것의 Index를 구하고
        const currentIndex = Checked.indexOf(value)

        // 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면
        const newChecked = [...Checked]

        if(currentIndex === -1){
            newChecked.push(value)
        }
        // 빼주고
        else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)     // 부모 컴포넌트에 전달한다.
        // State를 넣어준다.
    }
    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value.name)} 
            checked={Checked.indexOf(value.name) === -1 ? false : true}/>
                <span>{value.name}</span>

        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
// Collapse 참고 링크 : https://ant.design/components/collapse/