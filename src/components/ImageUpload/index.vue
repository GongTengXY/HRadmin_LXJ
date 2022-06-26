<template>
    <div>
        <!-- file-list是上传的文件列表 可以绑定到上传组件 让上传组件来显示 -->
        <!-- upload组件显示的是fileList的内容 -->
        <el-upload 
            list-type="picture-card" 
            :limit="1" 
            action="#"
            :on-preview="preview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :before-upload="beforeUpload"
            :http-request="upload"
            :file-list="fileList"
            :class="{disabled : fileComputed}">
        <i class="el-icon-plus"></i>
        </el-upload>
        <el-progress v-if="showPrecent" :percentage="precent" style="width : 180px" status="success"></el-progress>
        <el-dialog :visible.sync="showDialog" title="图片">
            <img :src="imgUrl" style="width : 100%" alt="">
        </el-dialog>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'   //引入腾讯云cos包
//实例化COS对象
const cos = new COS({
    SecretId : 'AKIDlLirlR2OYT9csuhFclfgT2OVN0NVQBhy',   //身份ID
    SecretKey : 'PZUAbomW2IOFreDXcR1OYTAfwyCD0Ztz',      //身份密钥
})
export default {
    data () {
        return {
            fileList : [],      //图片地址设置为数组
            showDialog : false,    //弹出状态
            imgUrl : '',
            currentFileUid : null,   //记录当前正在上传的uid
            precent : 0,           //当前的百分比
            showPrecent : false,   //进度条显示
        }
    },
    methods: {
        //点击预览事件
        preview(file) {
            this.imgUrl = file.url
            this.showDialog = true
        },
        handleRemove(file) {
            //将原来的文件排除掉，剩下的就是新数组
            this.fileList = this.fileList.filter(item => item.uid !== file.uid)
        },
        changeFile(file, fileList) {
            this.fileList = fileList.map(item => item)
            //上传文件时会触发，上传成功或者失败也会触发一次。上传后不会显示是因为action属性上传的地址为#是错误的，所以上传失败fileList会为空
        },
        beforeUpload(file) {
            // console.log(file)
            //先检查文件类型
            const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif']
            if(!types.some(item => item === file.type)) {
                this.$message.error('上传图片的格式只能是JPG、JPEG、GIF、BMP、PNG 格式!')
                return false   //上传终止
            }
            //检查图片储存大小 1M=1024KB 1KB=1024B
            const maxSize = 5 * 1024 * 1024
            if (file.size > maxSize) {
                this.$message.error('上传图片内存大小不得超过5M')
                return false
            }
            this.currentFileUid = file.uid   //记住当前上传此文件的uid
            this.showPrecent = true
            return true     //最后一定要return true
        },
        //自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
        upload(params) {
            // console.log(params.file)
            if(params.file) {
                cos.putObject({
                    Bucket: 'xiaoxin-1312587221', /*存储*/
                    Region: 'ap-chengdu',  /*地域*/
                    Key: params.file.name,  /* 文件名*/
                    StorageClass: 'STANDARD',   //上传的模式类型 直接默认 标准模式（写死）
                    Body: params.file, // 上传文件对象
                    onProgress : (progressData) => {         //上传进度
                        this.precent = progressData.percent * 100
                    }
                },(err, data) => {
                    if(!err && data.statusCode === 200) {
                        //此时说明文件上传成功
                        this.fileList = this.fileList.map(item => {
                            //找谁的uid等于刚刚记录的id
                            if(item.uid === this.currentFileUid) {
                                //找到了将成功的地址赋值给原来的url属性
                                return {url : 'http://'+ data.Location, upload : true}
                                //设置upload为true是做一个标记，根据有没有这个upload的标记来决定是否去保存
                            }
                            return item
                        })
                        

                        setTimeout(()=> {
                            this.showPrecent = false
                            this.precent = 0
                        },1000)
                        //将原来上传成功的图片 它的线上地址回写到fileList中，fileList改变 =》upload组件会自动更新视图
                    }
                })
            }
        }
    },
    computed : {             //设置计算属性来判断是否已经上传一张
        fileComputed () {
            return this.fileList.length === 1
        }
    }
}
</script>

<style>
.disabled .el-upload--picture-card {
    display: none;
}
</style>