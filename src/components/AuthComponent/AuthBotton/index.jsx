/**
  * @description: 按钮（权限判断）组件
  * @author: hj
  * @update: hj(2020-01-14)
  */
import React from 'react';
import {Button} from "@alifd/next";
import {Link} from "react-router-dom";

/**
 * auth： 权限字段
 * link.to 跳转路由
 * link.text 中间的文字
 *
 * title 按钮的字段
 * size  'small' | 'medium' | 'large'
 * type  'primary' | 'secondary' | 'normal'
 * text 显示 text 方式
 */
class AuthButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            target: this.props.target ? this.props.target : "",
            link: this.props.link ? this.props.link : {
                to: "/home",
                text: "跳转",
                toDefault: true
            },
            text: this.props.text,
            type: this.props.type ? this.props.type : "primary",
            size: this.props.size ? this.props.size : "small",
            title: this.props.title ? this.props.title :null,
            disabled: props.disabled
        }
    }

    /**
     * 在渲染前调用,在客户端也在服务端
     */
    componentWillMount = () => {

    };
    /**
     * 监听值的修改
     * @param props
     */
    componentWillReceiveProps = (props) => {
        this.setState({
            auth: props.auth,
            target: props.target ? props.target : "",
            link: props.link ? props.link : {
                to: "/home",
                text: "跳转",
                toDefault: true
            },
            text: props.text,
            type: props.type ? props.type : "primary",
            size: props.size ? props.size : "small",
            title: props.title ? props.title : null,
            disabled: props.disabled
        })
    };

    /**
     * 调用父级的权限操作
     */
    authOnclick = () => {
        if (this.props.onClick && typeof this.props.onClick == "function") {
            this.props.onClick();
        }
    };

    render() {
        const has = true;
        const text = this.state.title ? this.state.title:this.state.link.text;
        //有链接的
        if (!this.state.link.toDefault) {
            return has ? (
                <Link to={this.state.link.to} target={this.state.target}>
                    <Button text={text}
                            type={this.state.type}
                            size={this.state.size}
                            className={
                                text.indexOf('新建') > -1 ? 'sync-btn-add' :
                                text.indexOf('创建') > -1 ? 'sync-btn-add' :
                                text.indexOf('设置店内分类') > -1 ? 'sync-btn-add' :
                                text.indexOf('商品排序') > -1 ? 'sync-btn-add' :
                                text.indexOf('导入') > -1 ? 'sync-btn-add' :
                                text.indexOf('新增下级类目') > -1 ? 'sync-btn-normal' :
                                text.indexOf('新增') > -1 ? 'sync-btn-add' :
                                text.indexOf('生成统计') > -1 ? 'sync-btn-add' :
                                text.indexOf('添加') > -1 ? 'sync-btn-add' :
                                text.indexOf('查询') > -1 ? 'sync-btn-search' :
                                text.indexOf('批量删除') > -1 ? 'sync-btn-all-delete' :
                                text.indexOf('批量上架') > -1 ? 'sync-btn-all-special' :
                                text.indexOf('批量下架') > -1 ? 'sync-btn-all-special' :
                                text.indexOf('活动页排序') > -1 ? 'sync-btn-all-special' :
                                text.indexOf('删除') > -1 ? 'sync-btn-special' :
                                text.indexOf('启用') > -1 ? 'sync-btn-special' :
                                text.indexOf('停用') > -1 ? 'sync-btn-special' :
                                text.indexOf('审核') > -1 ? 'sync-btn-special' :
                                text.indexOf('上架') > -1 ? 'sync-btn-special' :
                                text.indexOf('下架') > -1 ? 'sync-btn-special' :
                                text.indexOf('导出') > -1 ? 'sync-btn-export' : 'sync-btn-normal'
                            }
                    >{this.state.link.text}</Button>
                </Link>
            ) : null;
        } else {
          console.log(this.state,text);
            //没有按钮的
            return has ? (
                <Button
                    text={text}
                    type={this.state.type}
                    size={this.state.size}
                    disabled={this.state.disabled}
                    className={
                        text.indexOf('新建') > -1 ? 'sync-btn-add' :
                        text.indexOf('创建') > -1 ? 'sync-btn-add' :
                        text.indexOf('设置店内分类') > -1 ? 'sync-btn-add' :
                        text.indexOf('商品排序') > -1 ? 'sync-btn-add' :
                        text.indexOf('新增下级类目') > -1 ? 'sync-btn-normal' :
                        text.indexOf('新增') > -1 ? 'sync-btn-add' :
                        text.indexOf('导入') > -1 ? 'sync-btn-add' :
                        text.indexOf('生成统计') > -1 ? 'sync-btn-add' :
                        text.indexOf('添加') > -1 ? 'sync-btn-add' :
                        text.indexOf('查询') > -1 ? 'sync-btn-search' :
                        text.indexOf('批量删除') > -1 ? 'sync-btn-special' :
                        text.indexOf('批量上架') > -1 ? 'sync-btn-all-special' :
                        text.indexOf('批量下架') > -1 ? 'sync-btn-all-special' :
                        text.indexOf('删除') > -1 ? 'sync-btn-special' :
                        text.indexOf('解绑StoreId') > -1 ? 'sync-btn-special' :
                        text.indexOf('解绑物流') > -1 ? 'sync-btn-special' :
                        text.indexOf('立即接单') > -1 ? 'sync-btn-normal' :
                        text.indexOf('放弃') > -1 ? 'sync-btn-special' :
                        text.indexOf('启用') > -1 ? 'sync-btn-special' :
                        text.indexOf('停用') > -1 ? 'sync-btn-special' :
                        text.indexOf('审核') > -1 ? 'sync-btn-special' :
                        text.indexOf('上架') > -1 ? 'sync-btn-special' :
                        text.indexOf('下架') > -1 ? 'sync-btn-special' :
                        text.indexOf('导出') > -1 ? 'sync-btn-export' : 'sync-btn-normal'
                    }
                    onClick={this.authOnclick}
                >
                    {this.state.title}
                </Button>
            ) : null;

        }
    }
}

export default AuthButton;
