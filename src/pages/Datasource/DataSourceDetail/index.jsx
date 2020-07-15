/**
  * @description: 数据中台-数据源-数据源管理-数据源详情
  * @author: hj
  * @update: hj(2020-01-14)
  */
import React from 'react';
import IceContainer from '@icedesign/container';
import {Button, Message} from '@alifd/next';
import {FormBinderWrapper as IceFormBinderWrapper,} from '@icedesign/form-binder';
import styles from './index.module.scss';
import url from '@/request'
import $http from '@/service/Services';


const axios = $http;

let form;

const Shape = {
    NO: 'normal',
    OFF: 'button'
};
const ItemDirection = {
    HORIZON: 'hoz',
    VERTICAL: 'ver'
};

/**
 * list
 */
class DataSourceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {},
            dataSource:{},
            param:[],
            arr: [{
                _id: Math.random().toString(36).substring(2),
                name: "",
                value: ""
            }],
            id: "",
            dataSourceId: "",
            addVisible: false,
            config: {
                data: null,
                visible: false,
                title: "",
                content: ""
            },

        };
        this.formChange = this.formChange.bind(this);
    }

    onShapeChange = (shape) => {
        this.setState({shape});
    }

    onItemDirectionChange = (itemDirection) => {
        this.setState({itemDirection});
    }

    /**
     * 在渲染前调用,在客户端也在服务端
     */
    componentWillMount = () => {
        const params = new URLSearchParams(this.props.location.search);
        const id = params.get("dataSourceId");
        this.setState({
            id: id
        });
        if (id) {
            const that = this;
            axios.get(url.url + '/v1/tDataSource/getDataSourceVoById/' + id)
                .then(function (response) {
                    const {data} = response;
                    if (data.code === 1) {
                        Message.warning(data.message ? data.message : data.data);
                    } else {
                        that.setState({
                            value: data.data.dataSourceVo,
                            dataSource:data.data.dataSourceVo,
                            param:data.data.parametersVos,
                            arr:data.data.parametersVos
                        })
                    }
                })
                .catch(function (error) {
                    Message.error(error.message);
                })
        }
    };

    /* 表改变
    * @param formValue
    */
    formChange = (formValue) => {
        this.setState({
            value: formValue
        })
    };

    /**
     * 表验证
     */
    validateAllFormField = () => {

    };
    /**
     * 取消提示弹框
     */
    onCloseDialog = reason => {
        this.setState({
            visible: false
        });
    };


    /**
     * 确定提示弹框
     */
    onOkDialogAdd = () => {
        const value = this.child.validateAllFormField();
        const {mockData} = this.state;
        mockData.push(value);
        this.setState({
            addVisible: false,
            mockData: mockData
        })
    };

    onCloseDialogAdd = () => {
        this.setState({
            addVisible: false
        });
    };

    /**
     * 表
     * @returns {*}
     */
    render() {
        return (
            <div>
                <div className='container-header'>
                    <p style={{display: 'inline-block'}}>数据源详情</p>
                    <Button type="normal" size="small" className='next-btn-normal table-btn-return' style={{float: 'right'}}>
                        <a onClick={() => {
                            this.props.history.go(-1)
                        }} > 返回</a>
                    </Button>
                </div>


                <IceContainer className='container-main'>
                    <IceFormBinderWrapper
                        value={this.state.value}
                        onChange={this.formChange}
                        ref={formRef => form = formRef}
                    >
                        <div className={styles.formContent}>
                            <h4 className={styles.dTitle}>基础信息</h4>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}>数据源类型：</div>
                                <span>{this.state.value.sourceType}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}> 数据源名称：</div>
                                <span>{this.state.value.sourceName}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}>描述:</div>
                                <span>{this.state.value.content}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}> 链接地址：</div>
                                <span>{this.state.value.ip}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}> 用户名：</div>
                                <span>{this.state.value.userName}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}> 密码：</div>
                                <span>{this.state.value.password}</span>
                            </div>
                            <div className={styles.formItem}>
                                <div className={styles.formLabel}>数据源方向：</div>
                                <span>{this.state.value.dataDirection}</span>
                            </div>
                            <div>
                                <div className={styles.formContent}>
                                    <h4 className={styles.dTitle}>参数设置</h4>
                                    <div className={styles.container} style={{marginTop: '0'}}>

                                    </div>
                                </div>
                                {
                                    this.state.arr.map(
                                        (o, index) => {
                                            return (
                                                <div id="addInput" className={styles.formItem}>
                                                    <div className={styles.formLabel}> 参数名称：</div>
                                                    <span>{o.name}</span>
                                                    <div className={styles.formLabel}> 参数值：</div>
                                                    <span>{o.value}</span>
                                                </div>
                                            )
                                        }
                                    )
                                }
                            </div>
                        </div>
                    </IceFormBinderWrapper>
                </IceContainer>
            </div>
        );
    }

}

export default DataSourceDetail;
