import { Component, OnInit, Input } from '@angular/core';
import { CarSelectorService } from '../../service/car-selector.service';
import { Car } from '../model/car.interface';
import { TrimEngine } from '../model/trim-engine.interface';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../notification.service'
@Component({
  selector: 'app-car-selector',
  templateUrl: './car-selector.component.html',
  styleUrls: ['./car-selector.component.scss'],
})
export class CarSelectorComponent implements OnInit {
  makes: string[] = [];
  models: string[] = [];
  years?: number[];
  cars: Car[] = [];
  selectedCars: Car[] = [];
  selectedMake: string | null = 'Select Option';
  selectedModel: string | null = 'Select Option';
  selectedYear: number[] = [];
  trimEngines: TrimEngine[] = [];
  selectedTrimEngines: TrimEngine[] = [];
  @Input() trims: TrimEngine[] = [];
  selectedTrims: string[] = [];
  makeModelYearTrims: any[] = [];
  showPopup: any;
  popupData: any[] = [];
  constructor(private carSelectorService: CarSelectorService,private notifyService : NotificationService) {}

  ngOnInit(): void {
    this.getMakes();
  }

  getMakes() {
    this.carSelectorService.getMakes().subscribe((makes: string[]) => {
      this.makes = makes;
    });
    this.getHide();
  }
  getHide() {
    this.trimEngines = [];
    this.showPopup = false;
  }
  getModelsByMake(make: string) {
    this.selectedModel = 'Select';
    if (make) {
      this.carSelectorService
        .getModelsByMake(make)
        .subscribe((models: string[]) => {
          this.models = models;
          this.years = [];
          this.selectedYear = [];
        });
    }
    this.getHide();
  }

  getYearsByMakeAndModel(make: string, model: string) {
    this.carSelectorService
      .getYearsByMakeAndModel(make, model)
      .subscribe((years: number[]) => {
        this.years = years;
        this.selectedYear = [];
      });
  }

  getTrimEnginesByCar(make: string, model: string, year: number[]) {
    const car: Car = { make, model, year };
    this.carSelectorService.getTrimEnginesByCar(car).subscribe(
      (response) => {
        this.trimEngines = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  showModal() {
    if(this.selectedTrims.length){
        this.showPopup = true;
        this.popupData = this.trimEngines
          .filter((item) =>
            item.value.some((val) => this.selectedTrims.includes(val.id))
          )
          .flatMap((item) =>
            item.value
              .filter((val) => this.selectedTrims.includes(val.id))
              .map((val) => ({
                id: val.id,
                trim: val.trim,
                engine: val.engine,
                make: item.make,
                model: item.model,
                year: item.year,
              }))
          );
    }else{
        this.notifyService.showWarning("This is warning", "Select Atleaset one Value")
    }
   
  }

  onMakeSelectionChange() {
    if (this.selectedMake?.length) {
      this.getModelsByMake(this.selectedMake);
    }
  }

  onModelSelectionChange() {
    if (this.selectedMake && this.selectedModel) {
      this.getYearsByMakeAndModel(this.selectedMake, this.selectedModel);
    }
  }

  onYearSelectionChange() {
    if (this.selectedMake && this.selectedModel && this.selectedYear) {
      this.getTrimEnginesByCar(
        this.selectedMake,
        this.selectedModel,
        this.selectedYear
      );
    }
  }
  selectOverAllTrims(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;
    this.trimEngines.forEach((trimEngine) => {
      this.selectTrim(trimEngine.trim, checked);
    });
  }
  selectAllTrims(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;
    this.trimEngines.forEach((trimEngine, index) => {
      this.selectMakeModelYear(trimEngine, event);
      this.isMakeModelYearSelected(trimEngine, index);
    });
  }

  selectTrim(trim: string, selected: boolean) {
    if (selected) {
      this.selectedTrims.push(trim);
    } else {
      const index = this.selectedTrims.indexOf(trim);
      if (index !== -1) {
        this.selectedTrims.splice(index, 1);
      }
    }
  }

  isTrimSelected(_id: string): boolean {
    return this.selectedTrims.includes(_id);
  }

  toggleTrimSelection(trim: string): void {
    console.log(this.selectedTrims, trim);
    if (this.selectedTrims.includes(trim)) {
      this.selectedTrims = this.selectedTrims.filter(
        (selectedTrim) => selectedTrim !== trim
      );
    } else {
      this.selectedTrims.push(trim);
    }
  }
  isMakeModelYearSelected(trimEngine: TrimEngine, index: number): boolean {
    if (this.selectedTrimEngines.length) {
      trimEngine.value.map((x) => {
        return;
      });
    }
    console.log(this.selectedTrimEngines);
    return this.selectedTrimEngines.some(
      (te) =>
        te.make === trimEngine.make &&
        te.model === trimEngine.model &&
        te.year === trimEngine.year
    );
  }

  selectMakeModelYear(trimEngine: TrimEngine, event: any) {
    if (event.target.checked) {
      const makeModelYearTrims = {
        make: trimEngine.make,
        model: trimEngine.model,
        year: trimEngine.year,
        trim: trimEngine.value.map((te) => te.id),
      };
      this.makeModelYearTrims.push(makeModelYearTrims);
      this.selectedTrimEngines.push(trimEngine);
      this.selectedTrims = [
        ...this.selectedTrims,
        ...trimEngine.value.map((te) => te.id),
      ];
    } else {
      const index = this.selectedTrimEngines.findIndex(
        (te) =>
          te.make === trimEngine.make &&
          te.model === trimEngine.model &&
          te.year === trimEngine.year
      );
      this.selectedTrimEngines.splice(index, 1);
      const trimsToRemove = trimEngine.value.map((te) => te.id);
      this.makeModelYearTrims.splice(index, 1);
      this.selectedTrims = this.selectedTrims.filter(
        (trim) => !trimsToRemove.includes(trim)
      );
    }
  }
}
