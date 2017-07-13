import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//    /* constructor(){//初始化方格组件状态
//         super();
//         this.state = {
//             value:null
//         }
//     }*/
//     render() {//渲染方格组件
//         return ( 
//             <button className = 'square' onClick={()=>this.props.handleClick()} >{/*点击将状态值改为X*/}
//                 {this.props.value}
//             </button>
//         )
//     }
// }

function Square(props){//函数式组件  只包含一个render方法  而不是扩展React.Component类定义的  函数式组件只需编写一个函数，传入props(属性)并返回应该渲染的内容就可以了
    var style = props.value == 'l' ? {color:'red',fontWeight:'bold'}:{fontWeight:'normal'}
    return(
            <button style={style} className = 'square' onClick={props.handleClick} >{/*点击将状态值改为X*/}
                {props.value?props.value == 'l' ?'X':props.value:''}
            </button>
        )
}

class BoradRow extends React.Component{

    renderSquare(index){//渲染一行方格组件  接收的参数为父组件传递过来的属性
        var arr = [];
        for(let i = index ; i<index+3;i++)//循环将方格组件push进数组
        {
            arr.push(<Square key={i} value={this.props.value[i]} handleClick={()=>this.props.handleClick(i)}/>)
        }
        //返回一行方格组件  多个子节点需要嵌套在一个父组件里面
        return (<div>{arr}</div>)
    }
    render(){//渲染一行方格组件
        return (<div  className="board-row">{this.renderSquare(this.props.index)}</div>)
    }
}

class Board extends React.Component {
    /*renderSquare(i) {
        return <Square / > ;
    }*/
    
    renderBoardRow(){//生成三行方格组件
        var arr = [];
        for(let i = 0;i<9;i+=3){//循环将一行方格组件push进数组
            arr.push(<BoradRow  key={i} index={i} value={this.props.squares} handleClick={x=>this.props.handleClick(x)} />)
        }
        //返回三行方格组件
        return <div>{arr}</div>
    }
    render() {//渲染九宫格
        
        return ( 
            <div >
                {this.renderBoardRow()}
            </div>
        )
    }
}

class Game extends React.Component{
    constructor(){ 
        super();
        this.state = {
            history:[{
                squares:Array(9).fill(null)
            }],
            xIsNext:true,
            stepNumber:0
        }
    }
    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)?false:true
        })
    }
    handleClick(index){
        const history = this.state.history.slice(0,this.state.stepNumber+1);//截取撤销后的数组长度

        const current = history[history.length -1];
        const squares = current.squares.slice();//调用slice函数复制数组
        const winner = calculateWinner(squares);
        if(winner || squares[index]){//如果有人取得胜利或者  点击的方格已经被填充结束该函数
            
            return;
        }
        squares[index] = this.state.xIsNext? 'X' : 'O';//根据xIsNext判断是X还是O  之在改变xIsNext状态  实现交替下棋
        this.setState({
            history:history.concat([{
                squares: squares
              }]),
            xIsNext:!this.state.xIsNext,
            stepNumber:history.length
        });
    }
    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);//计算是否有人取得胜利
        let status;
        if(winner){
            status = 'Winner : ' + current.squares[winner[0]];
            for(let i = 0 ;i < winner.length; i++)
            {
                current.squares[winner[i]] = 'l';
                console.log(current.squares[winner[i]] )
            }
            console.log(current.squares,winner)
            /*this.setState({
            history:history.concat([{
                squares: current.squares
                  }])
            });*/
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step,move) => {//第一个参数是数组元素值，第二个参数是数组元素索引
            const desc = move?
            'Move #(' + ((move%2)?1:2)+','+((move%2)?move/2+0.5:move/2) +')':
            'Game Start';
            const style = move == this.state.stepNumber ? {fontWeight:'bold'}:{fontWeight:'normal'};//当前步骤或被选中加粗
            return (
                <li key={move}>
                    <a href="#" style={style} onClick={()=>this.jumpTo(move)}>{desc}</a>
                </li>
                )
        })
        return(
            <div className='game'>
                <div className="game-board">
                    <Board  squares={current.squares} handleClick={x=>this.handleClick(x)} />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Game />,document.getElementById('root'));

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for(let i = 0 ; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return lines[i];
        }
    }
    return null;
}