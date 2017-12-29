﻿import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Filter, Grid, Page, QueryCellInfoEventArgs, Sort, Toolbar } from '@syncfusion/ej2-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { Ajax } from '@syncfusion/ej2-base';

Grid.Inject(Sort, Page, Filter, Toolbar);
declare let storiesList: any;

let progressModel: HTMLInputElement = document.getElementById('progressDialogModal') as HTMLInputElement;

(<any>window).editClick = function (id) {
	alert(id);
};
(<any>window).deleteClick = function (id) {
    
    
    var confirm = (<any>window).confirm("Are you sure you want to delete project? Once deleted it cannot be recovered.");

    if (!confirm)
        return false;

    $.ajax({
        data: { 'projectId': id},
        success: function (response) {
            if (response.isSuccess === true) {
               // window.location.href = "/products#all";
                toastr.success(response.message);
            }
            else {
                toastr.error(response.message);
            }
        },
        error: function () {
            toastr.error("Unexpected error occured");
        },
        complete: function () {
        },
        type: 'POST',
        timeout: 180000,
        url: '/project/delete/' + id,
    });

};
(<any>window).faviouriteClick = function (id) {

    

    $.ajax({
        data: { 'projectId': id },
        success: function (response) {
            if (response.isSuccess === true) {
                // window.location.href = "/products#all";
                toastr.success(response.message);
            }
            else {
                toastr.error(response.message);
            }
        },
        error: function () {
            toastr.error("Unexpected error occured");
        },
        complete: function () {
        },
        type: 'POST',
        timeout: 180000,
        url: '/project/favourite/' + id,
    });
};

//let sharedialogObj: Dialog = new Dialog({
//	width: '600px',
//	height: '300px',
//	header: 'Share Project',
//	//created: dlgCreate,
//	content: '<input type="email" name="email">',
//	closeOnEscape: false,
//	target: document.getElementById('targetbody'),
//	isModal: true,
//	showCloseIcon: true,
//	animationSettings: { effect: 'None' },
//	buttons: [{
//		click: cancelButtonClick,
//		buttonModel: { id: 'addprojectCancelButton', content: 'Cancel', cssClass: 'e-flat dlg-btn-secondary' },
//	}],
//});
//sharedialogObj.appendTo('#sharemodalDialog');
//sharedialogObj.hide();

//function cancelButtonClick(): void {
//	sharedialogObj.hide();
//}

(<any>window).permissionClick = function (id) {
	alert(id);
};

(<any>window).favouritesClick = function (id) {
	loadprojectsTab(id);
};

(<any>window).yoursClick = function (id) {
	loadprojectsTab(id);
};

(<any>window).allClick = function (id) {
	loadprojectsTab(id);
};

function loadprojectsTab(projectId) {
	progressModel.style.cssText = "display : block";
	document.getElementById('projecttabGrid').innerHTML = "";
	let url = "/projecttab/";
	$.ajax({
		data: {
			'projectId': projectId,
		},
		error: function (response) {

		},
		success: function (response) {
			$('#projecttabGrid').html(response);
			progressModel.style.cssText = "display : none";
		},
		type: "POST",
		url: url,
	});
}


    let ajax: Ajax = new Ajax("/project/addproject", "GET", true);
    ajax.send().then();
    ajax.onSuccess = (data: string): void => {
        ;
        let newdialogObj: Dialog = new Dialog({
            width: '600px',
            height: '300px',
            header: 'Add Project',
            //created: dlgCreate,
            content: data,
            closeOnEscape: false,
            target: document.getElementById('targetbody'),
            isModal: true,
            showCloseIcon: true,
            animationSettings: { effect: 'None' },
            buttons: [{
                click: clearButtonClick,
                buttonModel: { id: 'addprojectClearButton', content: 'Clear', cssClass: 'e-flat dlg-btn-secondary' },
            },
            {
                click: cancelButtonClick,
                buttonModel: { id: 'addprojectCancelButton', content: 'Cancel', cssClass: 'e-flat dlg-btn-secondary' },
            },
            {
                click: addButtonClick,
                buttonModel: { id: 'addprojectAddbutton', content: 'Add', cssClass: 'e-flat', isPrimary: true },
            }],
            open: addMilestonedialogOpen,
        });
        newdialogObj.appendTo('#projectmodalDialog');
        newdialogObj.hide();

        document.getElementById('projectmodalDialog').style.maxHeight = '300px';

        function addButtonClick(): void {
            $('#erroraddproject').css('display', 'none');
            progressModel.style.cssText = "display : block";
            document.getElementById("errorprojectDescription").style.visibility = "hidden";
            let canCreateproject = true;

            let errorprojectName = document.getElementById('errorprojectName') as HTMLInputElement;

            let projectNameContainer = document.getElementById('projectnameinput') as HTMLInputElement;
            let descriptionContainer = document.getElementById('descriptioninput') as HTMLInputElement;
           
            if (projectNameContainer.value !== "" ) {

                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    url: '/project/updateproject',
                    data: {
                        'description': descriptionContainer.value, 'projectname': projectNameContainer.value
                    },
                    error: function (response) {
                        $('#erroraddproject').text("Unexpected error occured");
                        $('#erroraddproject').css('display', 'block');
                    },
                    success: function (response) {
                        if (response.status === false) {
                            if (response.isprojectNameExists === true) {
                                document.getElementById('errorprojectName').innerHTML = response.result;
                                document.getElementById("errorprojectName").style.display = "block";
                            }
                            else {
                                $('#erroraddproject').text(response.result);
                                $('#erroraddproject').css('display', 'block');
                            }
                        }
                        else if (response.status === true) {
                            toastr.success(response.message);
                            newdialogObj.hide();
                            location.reload();
                        }
                    },
                    complete: function () {                        
                    progressModel.style.cssText = "display : none";
                    },
                });

            }
            else {
               // document.getElementById('progressDialogModal').style.display = 'none';
                if (projectNameContainer.value === "") {
                    errorprojectName.innerHTML = "Required Field";
                    errorprojectName.style.display = "block";
                }  
            }

        }

        function cancelButtonClick(): void {
            newdialogObj.hide();
        }

        function addMilestonedialogOpen(): void {
            (document.getElementsByTagName('body')[0] as HTMLElement).classList.add('mainscroller-hide');
        }
        function clearButtonClick(): void {
            $('#erroraddproject').css('display', 'none');
            let projectNameContainer = document.getElementById('projectnameinput') as HTMLInputElement;
            projectNameContainer.value = "";

            let errorprojectName = document.getElementById('errorprojectName') as HTMLInputElement;
            errorprojectName.value = "";
            errorprojectName.innerHTML = "";

            let descriptionContainer = document.getElementById('descriptioninput') as HTMLInputElement;
            descriptionContainer.value = "";

        }

        (<any>window).myFunction = function () {
            newdialogObj.show();
        };
	}


	let ajaxshare: Ajax = new Ajax("/project/shareproject", "GET", true);
	ajaxshare.send().then();
	
	ajaxshare.onSuccess = (data: string): void => {
		;
		let sharedialogObj: Dialog = new Dialog({
			width: '600px',
			height: '500px',
			header: 'Share Project',
			//created: dlgCreate,
			content: data,
			closeOnEscape: false,
			target: document.getElementById('targetbody'),
			isModal: true,
			showCloseIcon: true,
			animationSettings: { effect: 'None' },
			buttons: [{
				click: cancelButtonClick,
				buttonModel: { id: 'addprojectCancelButton', content: 'Cancel', cssClass: 'e-flat dlg-btn-secondary' },
			}],
		});
		sharedialogObj.appendTo('#sharemodalDialog');
		sharedialogObj.hide();

		document.getElementById('sharemodalDialog').style.maxHeight = '500px';

		function cancelButtonClick(): void {
			sharedialogObj.hide();
		}

		(<any>window).shareClick = function (id) {
			sharedialogObj.id = id;
			let button = new Button({ cssClass: 'e-success' });
			button.appendTo('#sharebtn');
			let projectNameContainer = document.getElementById('shareEmail') as HTMLInputElement;
			projectNameContainer.value = "";
			let shareEmailContainer = document.getElementById('shareLinks') as HTMLInputElement;
			shareEmailContainer.value = window.location.href;
			sharedialogObj.show();
		};

		sharedialogObj.overlayClick = (): void => {
			sharedialogObj.hide();
		};

		document.getElementById('sharebtn').onclick = (): void => {
			let emailContainer = document.getElementById('shareEmail') as HTMLInputElement;
			let erroremail = document.getElementById('erroremail') as HTMLInputElement;
			if (emailContainer.value !== "") {
				//if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailContainer.value)){
				//	erroremail.innerHTML = "You have entered an invalid email address";
				//	erroremail.style.display = "block";
				//}
				//else {
					$.ajax({
						dataType: 'json',
						type: "GET",
						url: '/project/shareemail',
						data: {
							'projectId': sharedialogObj.id, 'email': emailContainer.value
						},
						error: function (response) {

						},
						success: function (response) {
							if (response.status === true) {																
								sharedialogObj.show();
							}							
						},
						complete: function () {

						},
					});
				}				
			//}
			else {
				if (emailContainer.value === "") {
					erroremail.innerHTML = "Required Field";
					erroremail.style.display = "block";
				}
			}
		};
